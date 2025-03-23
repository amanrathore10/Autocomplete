export const isNonEmptyArray = <T>(arr: T[]): boolean => {
    return Array.isArray(arr) && arr.length > 0;
}

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}