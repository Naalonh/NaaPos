import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

source_folders = [
    r"D:\Naalonh-POS\Naalonh-Pos\src\components",
    r"D:\Naalonh-POS\Naalonh-Pos\src\components\products",
    r"D:\Naalonh-POS\Naalonh-Pos\src\components\common",
    r"D:\Naalonh-POS\Naalonh-Pos\src\pages"
]

output_folder = "./txt_files"
os.makedirs(output_folder, exist_ok=True)


def convert_jsx_to_txt(file_path):
    if file_path.endswith(".jsx"):
        filename = os.path.basename(file_path)
        txt_name = filename.replace(".jsx", ".txt")
        txt_path = os.path.join(output_folder, txt_name)

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"Updated: {filename} -> {txt_name}")


class JSXWatcher(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory:
            convert_jsx_to_txt(event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            convert_jsx_to_txt(event.src_path)


observer = Observer()
event_handler = JSXWatcher()

# Watch multiple folders
for folder in source_folders:
    observer.schedule(event_handler, folder, recursive=True)

observer.start()

print("Watching JSX files...")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()