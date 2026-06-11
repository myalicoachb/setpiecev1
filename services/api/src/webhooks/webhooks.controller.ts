import { Controller, Post, Req, Res, Headers, RawBody } from '@nestjs/common'
import { Request, Response } from 'express'
import { WebhooksService } from './webhooks.service'

@Controller('webhooks')
export class WebhooksController {
  constructor(private service: WebhooksService) {}

  @Post('stripe')
  async handleStripe(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.service.handleStripeEvent(signature, req.body)
    return res.json(result)
  }

  @Post('mux')
  async handleMux(@Req() req: Request, @Res() res: Response) {
    const result = await this.service.handleMuxEvent(req.body)
    return res.json(result)
  }
}
