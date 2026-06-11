import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { VideosService } from './videos.service'

@Controller('videos')
export class VideosController {
  constructor(private service: VideosService) {}

  @Get()
  findAll(@Query() query: { category?: string; q?: string; page?: number; limit?: number }) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { title: string; description?: string; url: string; category?: string; thumbnailUrl?: string }) {
    return this.service.create(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
