import type {MulterFile} from "../../../../common/type/common.type";
import {extname} from "path";

// 이미지 썸네일 확장자
const allowedImgaeExtensions = [
    '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif',
    '.tiff', '.avif', '.heif', '.heic'];

// 영상 썸네일 확장자
const allowedVideoExtensions = [
    '.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv',
    '.webm', '.ts', '.m4v', '.3gp', '.mpeg', '.mpg'
];

// pdf 썸네일 확장자
const allowedPdfExtensions = ['.pdf'];

// ppt 썸네일 확장자
const allowedPptExtensions = ['.ppt', '.pptx', '.odp'];

// excel 썸네일 확장자
const allowedExcelExtensions = ['.xls', '.xlsx', '.ods', '.csv'];

export const thumbnailUtils = (file: MulterFile) => {
    const fileExt = extname(file.originalname).toLowerCase();

    if (allowedImgaeExtensions.includes(fileExt)) {

    }else if (allowedVideoExtensions.includes(fileExt)) {

    }else if (allowedPdfExtensions.includes(fileExt)) {

    }else if (allowedPptExtensions.includes(fileExt)) {

    }else if (allowedExcelExtensions.includes(fileExt)) {

    }else{

    }
};