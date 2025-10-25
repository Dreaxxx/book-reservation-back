import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { ApiTags, ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guards";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBooksDto } from "./dto/search-book-dto";

@ApiTags('Books')
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @ApiOkResponse({ description: 'Search books' })
  @Get("search")
  async search(@Query() dto: SearchBooksDto) {
    console.log("dto", dto)
    const result = await (this.booksService.search(dto));
    console.log("result", result);
    return result;
  }

  @ApiOkResponse({ description: 'Get a book by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @ApiOkResponse({ description: 'List of all books' })
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'The book has been successfully created.' })
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'The book has been successfully updated.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.patch(dto, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'The book has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.delete(id);
  }
}
