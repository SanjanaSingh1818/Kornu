import type { StructureResolver } from "sanity/structure";
import { PAGE_FOLDERS } from "./schemaTypes";

const emoji = (char: string) => () => char;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Kör Nu website")
    .items(
      PAGE_FOLDERS.map((folder, index) =>
        S.listItem()
          .title(folder.title)
          .id(`folder-${index}`)
          .icon(emoji(folder.icon))
          .child(
            S.list()
              .title(folder.title)
              .items(folder.items.map((item) =>
                S.listItem()
                  .title(item.title)
                  .id(`${index}-${item.id}`)
                  .child(S.document().schemaType(item.id).documentId(item.id).title(item.title)),
              )),
          ),
      ),
    );
