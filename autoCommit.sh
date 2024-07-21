#!/bin/bash
# 将执行结果追加到日志文件
git add .
git commit -m "更新文档"
git pull >> git.log
# 为方便查看，追加一行日期
date >> git.log
# 同样，追加分割线
echo "==========" >> git.log
