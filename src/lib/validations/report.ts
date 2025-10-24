import { z } from 'zod';

export const createReportSchema = z.object({
  cafeId: z.string().uuid('有効なカフェIDを指定してください'),
  seatStatus: z.enum(['available', 'crowded', 'full'], {
    errorMap: () => ({ message: '空席状況を選択してください' }),
  }),
  quietness: z.enum(['quiet', 'normal', 'noisy'], {
    errorMap: () => ({ message: '静かさを選択してください' }),
  }),
  wifi: z.enum(['fast', 'normal', 'slow', 'none'], {
    errorMap: () => ({ message: 'Wi-Fi速度を選択してください' }),
  }),
  powerOutlets: z.boolean({
    errorMap: () => ({ message: '電源席の有無を選択してください' }),
  }),
  comment: z.string().max(50, 'コメントは50文字以内で入力してください').optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
