import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { calculateShipping, getVerifiedReviews, naturalLanguageSearch } from "./integrations";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  discovery: router({
    naturalLanguageSearch: publicProcedure
      .input(z.object({ query: z.string().trim().min(1).max(500) }))
      .query(({ input }) => naturalLanguageSearch(input.query)),
    reviews: publicProcedure
      .input(z.object({ productId: z.string().trim().min(1).max(100) }))
      .query(({ input }) => getVerifiedReviews(input.productId)),
    shippingQuote: publicProcedure
      .input(z.object({ region: z.enum(["RU_MOSCOW", "RU_CENTRAL", "RU_NORTHWEST", "RU_SOUTH", "RU_VOLGA", "RU_URAL", "RU_SIBERIA", "RU_FAR_EAST"]), subtotal: z.number().finite().min(0).max(100000) }))
      .query(({ input }) => calculateShipping(input.region, input.subtotal)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
