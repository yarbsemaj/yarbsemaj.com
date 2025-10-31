export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
export function map(n: number, start1: number, end1: number, start2: number, end2: number): number {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

export function check_webp_feature(feature: string, callback: (feature: string, supported: boolean) => void) {
    var kTestImages = {
        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
        alpha:
            'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
        animation:
            'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
    };
    var img = new Image();
    img.onload = function () {
        var result = img.width > 0 && img.height > 0;
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = 'data:image/webp;base64,' + kTestImages[feature];
}

export function animateValue(startTime: number, startValue: number, endValue: number, animationDuration: number) {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;

    if (elapsedTime < animationDuration) {

        return { value: ((elapsedTime / animationDuration) * (endValue - startValue)) + startValue, isAnimating: true };
    } else {
        return { value: endValue, isAnimating: false };
    }
}