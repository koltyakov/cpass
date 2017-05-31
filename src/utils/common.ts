import { createHash } from 'crypto';

export const hash = (data: string): string => {
    return createHash('sha256').update(data).digest('hex');
};
