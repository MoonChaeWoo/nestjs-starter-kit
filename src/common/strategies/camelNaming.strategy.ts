import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CamelNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return customName || propertyName; // camelCase 유지
    }

    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName || targetName;
    }

    relationName(propertyName: string): string {
        return propertyName;
    }
}
