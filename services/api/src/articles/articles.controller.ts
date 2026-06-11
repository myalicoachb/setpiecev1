import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ArticlesService } from './articles.service'

@Controller('articles')
export class ArticlesController {
  constructor(private service: ArticlesService) {}

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
  create(@Body() body: { title: string; content: string; excerpt?: string; category?: string; imageUrl?: string }) {
    return this.service.create(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title?: string; content?: string; excerpt?: string; category?: string; imageUrl?: string }) {
    return this.service.update(id, body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
