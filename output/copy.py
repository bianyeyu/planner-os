import os
import shutil

def main():
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 创建目标文件夹
    target_dir = os.path.join(script_dir, "output")
    os.makedirs(target_dir, exist_ok=True)

    # 遍历文件并使用相对路径重命名
    for root, dirs, files in os.walk(script_dir):
        # 跳过以 . 开头的文件和 node_modules 文件夹
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "node_modules"]
        files[:] = [f for f in files if not f.startswith(".")]

        for file in files:
            source_path = os.path.join(root, file)
            # 获取相对路径
            relative_path = os.path.relpath(source_path, script_dir)

            # 将相对路径中的路径分隔符替换为下划线
            new_filename = relative_path.replace(os.sep, "_")

            # 如果文件位于顶层目录，则去除 "output_" 前缀
            if not os.sep in relative_path:
                new_filename = new_filename.replace("output_", "")

            target_path = os.path.join(target_dir, new_filename)

            # 复制文件
            shutil.copy2(source_path, target_path)

            # 打印旧文件名和新文件名
            print(f"已复制并重命名: {relative_path} -> {new_filename}")

    print("文件复制完成！")

if __name__ == "__main__":
    main()