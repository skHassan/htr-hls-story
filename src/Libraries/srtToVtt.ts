export const moduleName = 'toWebVTT';

/**
 * Convert SRT content to VTT format
 * @param utf8str - The SRT content as string
 * @returns Converted VTT content
 */
const toVTT = (utf8str: string): string => utf8str
    .replace(/\{\\([ibu])\}/g, '</$1>')
    .replace(/\{\\([ibu])1\}/g, '<$1>')
    .replace(/\{([ibu])\}/g, '<$1>')
    .replace(/\{\/([ibu])\}/g, '</$1>')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
    .concat('\r\n\r\n');

/**
 * Convert SRT from URL to VTT blob URL
 * @param url - URL of the SRT file
 * @returns Promise resolving to VTT blob URL
 * @throws Error if fetch fails or content processing fails
 */
const toWebVTT = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${moduleName}: Failed to fetch SRT file`);
        }

        const text = await response.text();
        const vttContent = 'WEBVTT FILE\r\n\r\n' + toVTT(text);
        
        return URL.createObjectURL(new Blob([vttContent], { type: 'text/vtt' }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`${moduleName}: ${errorMessage}`);
    }
};

export default toWebVTT;