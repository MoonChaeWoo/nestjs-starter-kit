import {Injectable, OnModuleInit} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {RoleEntity} from "../../../modules/role/entities/role.entity";
import PermissionEnum from "../../../common/constants/permission.const";
import RolesEnum from "../../../common/constants/roles.const";
import {PermissionEntity} from "../../../modules/permission/entities/permission.entity";

type AccessEntity = PermissionEntity | RoleEntity;
type AccessEnum = PermissionEnum | RolesEnum;

/**
 * InitialDataDatabaseService
 * --------------------------
 * NestJS 모듈 초기화 시 실행되는 서비스임.
 * 기본 권한(Permission)과 역할(Role) 데이터를 DB에 자동으로 세팅함.
 *
 * CreateDatabaseService 이후 실행되는 서비스임.
 *
 * 동작 순서:
 * 1. onModuleInit 실행됨 → 모듈 초기화 시 자동 호출됨
 * 2. PermissionEntity, RoleEntity 레포지토리 가져옴
 * 3. accessControlReady 호출 → PermissionEnum, RolesEnum 기준으로 데이터 존재 여부 확인
 *    - 없으면 자동 생성함
 * 4. linkRolesPermissions 호출 → 각 역할(Role)에 기본 권한(Permission) 연결
 * 5. 모든 작업 완료 시 로그 출력함
 *
 * 특징:
 * - DB에 권한/역할이 없으면 자동 생성함
 * - 역할별 기본 권한을 사전에 정의된 Enum 기준으로 연결함
 * - 비동기 처리됨, 예외 발생 시 콘솔에 출력함
 *
 * 사용 예:
 * NestJS 모듈에서 providers에 등록하면 App 초기화 시 자동 실행됨
 *
 * 예외:
 * - DB 연결 실패, 쿼리 실행 오류 발생 시 콘솔에 에러 출력함
 */
@Injectable()
export class InitialDataDatabaseService implements OnModuleInit{

    constructor(private readonly dataSource: DataSource){}

    async onModuleInit() {
        try{
            const permRepository = this.dataSource.getRepository(PermissionEntity);
            const roleRepository = this.dataSource.getRepository(RoleEntity);

            // 권한 관련 데이터 세팅
            await this.accessControlReady(permRepository, PermissionEnum);
            await this.accessControlReady(roleRepository, RolesEnum);
            await this.linkRolesPermissions(permRepository, roleRepository);

            console.log('Roles & Permissions 자동 등록 완료');
        }catch(e){
            console.error(e);
        }
    }

    async accessControlReady<
        T extends AccessEntity,
        U extends AccessEnum
    >(repository: Repository<T>, enumObj: Record<string, U>): Promise<void> {
        for(const access of Object.values(enumObj)){
            const target = await repository.findOne({where : {name : access} as any});
            if(!target){
                await repository.save(repository.create({name : access} as any));
            }
        }
    }

    async linkRolesPermissions(permRepository: Repository<PermissionEntity>, roleRepository: Repository<RoleEntity>): Promise<void> {
        const permissions = await permRepository.find();
        const roles = await roleRepository.find({ relations: ['permissions'] });

        for (const role of roles) {
            if (!role.permissions || role.permissions.length === 0) {
                let assigned: PermissionEntity[] = [];

                // 역할별 기본 권한 지정
                // 디폴트 권한 배열에 지정
                switch (role.name) {
                    case RolesEnum.SUPER_ADMIN:
                        assigned = permissions; // 모든 권한
                        break;
                    case RolesEnum.MANAGER:
                        assigned = permissions.filter(p =>
                            [PermissionEnum.READ_USER, PermissionEnum.WRITE_USER, PermissionEnum.READ_POST].includes(p.name as PermissionEnum),
                        );
                        break;
                    case RolesEnum.CONTENT_EDITOR:
                        assigned = permissions.filter(p =>
                            [PermissionEnum.READ_POST, PermissionEnum.WRITE_POST].includes(p.name as PermissionEnum),
                        );
                        break;
                    case RolesEnum.VIEWER:
                        assigned = permissions.filter(p =>
                            [PermissionEnum.READ_USER, PermissionEnum.READ_POST].includes(p.name as PermissionEnum),
                        );
                        break;
                }

                role.permissions = assigned;
                await roleRepository.save(role);
            }
        }
    }
}