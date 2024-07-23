import { ActionParam, Area, Body, Controller, Ctx, Get, HttpContext, Post } from "alosaur/mod.ts";
import { readAll } from "https://deno.land/std@0.213.0/streams/read_all.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.213.0/streams/reader_from_stream_reader.ts"

@Controller()
export class CoreController {
  @Get()
  @ActionParam(0, Ctx())
  text(ctx: HttpContext) {
    return `
        <form action="/"  method="post" enctype="multipart/form-data">
            <input type="file" id="file" name="file">
            <input type="submit">
        </form>`;
  }

  /**
   * This example has custom body parsed options
   */
  @Post()
  @ActionParam(0, Body(null, { formData: { maxMemory: 1 } }))
  async formData(
    body: FormData,
  ) {
    const firstFile = body.get("file");

    if (firstFile instanceof File) {
      const fileDest = "./examples/form-data/files/" + firstFile.name;

      // write file if file has content in memory
      if (firstFile.size) {
        const reader = firstFile.stream().getReader();
        const stream = readerFromStreamReader(reader);
        const file = await readAll(stream);

        await Deno.writeFile(fileDest, file, { append: true });
      }

      return "Uploaded";
    }

    return "File not exist";
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}
