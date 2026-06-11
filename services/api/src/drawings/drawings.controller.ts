import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DrawingsService } from './drawings.service'

@Controller('drawings')
export class DrawingsController {
  constructor(private service: DrawingsService) {}

  @Get()
  findAll(@Query() query: { page?: number; limit?: number }) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { title: string; svgContent?: string; imageUrl: string; width?: number; height?: number }) {
    return this.service.create(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title?: string; svgContent?: string; imageUrl?: string; width?: number; height?: number }) {
    return this.service.update(id, body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
