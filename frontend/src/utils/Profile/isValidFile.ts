export const isValidFile = (file: File | null): boolean => {
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    const validFileExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    if (file === null) {
        return false;
    }

    if (!validMimeTypes.includes(file.type)) {
        return false;
    }
    const fileName = file.name.toLowerCase();

    if (!validFileExtensions.some((ext) => fileName.endsWith(ext))) {
        return false;
    }

    return true;
};
