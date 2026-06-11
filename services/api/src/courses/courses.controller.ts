import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CoursesService } from './courses.service'

@Controller('courses')
export class CoursesController {
  constructor(private service: CoursesService) {}

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
  create(@Body() body: { title: string; description?: string; category?: string; price?: number; thumbnailUrl?: string }) {
    return this.service.create(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Req() req: any) {
    return this.service.enroll(id, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/progress')
  updateProgress(@Param('id') id: string, @Body() body: { lessonId: string }, @Req() req: any) {
    return this.service.updateProgress(id, req.user.id, body.lessonId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/progress')
  getProgress(@Param('id') id: string, @Req() req: any) {
    return this.service.getProgress(id, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
