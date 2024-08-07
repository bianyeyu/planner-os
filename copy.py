import os

def print_tree(path, prefix="", f=None):
    """打印目录树结构到文件"""
    items = os.listdir(path)
    # 过滤掉以 . 开头的文件和 node_modules 文件夹
    items = [item for item in items if not item.startswith(".") and item != "node_modules"]
    pointers = [tee] * (len(items) - 1) + [last]
    for pointer, item in zip(pointers, items):
        if f:
            f.write(prefix + pointer + item + "\n")
        else:
            print(prefix + pointer + item)
        new_path = os.path.join(path, item)
        if os.path.isdir(new_path):
            print_tree(new_path, prefix + ("│   " if pointer == tee else "    "), f)

def main():
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    script_name = os.path.basename(__file__)  # 获取脚本文件名

    # 创建输出文件
    output_file = os.path.join(script_dir, "output.txt")
    with open(output_file, "w", encoding="utf-8") as f:
        # 打印目录树结构到文件
        f.write("文件路径结构图:\n")
        print_tree(script_dir, f=f)
        f.write("\n\n")

        # 遍历文件
        for root, dirs, files in os.walk(script_dir):
            # 跳过以 . 开头的文件和 node_modules 文件夹
            dirs[:] = [d for d in dirs if not d.startswith(".") and d != "node_modules"]
            files[:] = [f for f in files if not f.startswith(".") and f != script_name]  # 排除自身

            for file in files:
                # 跳过 package-lock.json 文件
                if file == "package-lock.json":
                    continue

                source_path = os.path.join(root, file)
                # 获取相对路径
                relative_path = os.path.relpath(source_path, script_dir)

                try:
                    # 读取文件内容
                    with open(source_path, "r", encoding="utf-8") as code_file:
                        code = code_file.read()

                    # 写入输出文件
                    f.write(f"----- {relative_path} -----\n")
                    f.write(code)
                    f.write("\n\n")
                except UnicodeDecodeError:
                    print(f"无法读取文件: {relative_path} (编码错误)")
                except Exception as e:
                    print(f"发生错误: {relative_path} ({e})")

    print("文件合并完成！")

if __name__ == "__main__":
    # 定义目录树符号
    tee = "├── "
    last = "└── "
    main()