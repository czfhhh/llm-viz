
# Brendan Bycroft's Home Page & Projects

> 本仓库 fork 自 [bbycroft/llm-viz](https://github.com/bbycroft/llm-viz)，在此基础上进行了中文化翻译，方便中文用户学习 LLM 推理过程。

## 翻译说明

已将 LLM 分步讲解（walkthrough）的全部说明文本翻译为中文，覆盖以下章节：

| 章节 | 原文 | 翻译 |
|---|---|---|
| Overview | 概览 | 项目介绍、token/词汇表、嵌入、Transformer 流程 |
| Preliminary | 预备知识 | GPT 家族背景、minGPT 项目介绍 |
| Embedding | 嵌入 | Token 嵌入、位置嵌入的生成与相加 |
| Layer Norm | 层归一化 | 均值/标准差计算、γ/β 权重偏置 |
| Self Attention | 自注意力 | Q/K/V 向量、点积运算、因果注意力、注意力矩阵 |
| Softmax | Softmax | 指数化、归一化、数值稳定性、argmax 对比 |
| Projection | 投影 | 多头输出合并、残差连接 |
| MLP | MLP | 线性变换、GELU 激活函数、投影 |
| Transformer | Transformer | Transformer 块整体、低层/高层特征 |
| Output | 输出 | Logits、概率分布、采样、温度参数 |

同时翻译了 UI 元素：章节标题、按钮文字、相位列表、提示文字等。

> Walkthrough04 中保留了少数 JSX 内嵌标题的英文（如 "Software analogy"、"Lookup table" 等），不影响学习主线。

This repository contains my (Brendan's) homepage, as well as a number of non-trivial projects.

They are kept in a single repository for ease of deployment, as well as sharing a bunch of js utils
which are otherwise a pain to share around.

## Projects

The main projects are:
* LLM Visualization: 3D interactive model of a GPT-style LLM network running inference.
* [WIP] CPU Simulation: A 2D digital schematic editor with full a execution model, showcasing a simple
  RISC-V based CPU

### LLM Visualization

This project displays a 3D model of a working implementation of a GPT-style network. That
is, the network topology that's used in OpenAI's GPT-2, GPT-3, (and maybe GPT-4).

The first network displayed with working weights is a tiny such network, which sorts a small list
of the letters A, B, and C. This is the demo example model from Andrej Karpathy's
[minGPT](https://github.com/karpathy/minGPT) implementation.

The renderer also supports visualizing arbitrary sized networks, and works with the smaller gpt2
size, although the weights aren't downloaded (it's 100's of MBs).

### CPU Simulation (WIP; not exposed yet!)

This project runs 2D schematic digital circuits, with a fully fledged editor. The intent is to
add a number of walkthroughs, showing things such as:
  * how a simple RISC-V CPU is constructed
  * the constituent parts down to gate level: instruction decode, ALU, add, etc
  * higher level CPU ideas, like various levels of pipelining, caching, etc

## 工程总结

本仓库是 Brendan Bycroft 的个人主页与项目集合，所有项目放在同一 repo 以方便部署、共享 JS 工具。

- **框架**：Next.js 13.4（`appDir` 实验性目录）+ React 18 + TypeScript 5
- **样式**：Tailwind + SCSS + PostCSS，入口 `styles/main.css`
- **3D 渲染**：WebGPU / WebGL2（`src/llm/render/*`），不支持 WebGL2 的浏览器会给出提示
- **计算后端**：WebAssembly。源码用 Odin 语言写在 `src/llm/wasm/*.odin`，预编译产物 `public/native.wasm` 已随仓库提交，开箱即用
- **模型权重**：`public/gpt-nano-sort-model.json`（Karpathy minGPT 的 nano 排序小模型，已含）。GPT-2 完整权重不下载（数百 MB）

路由：
- `/`：主页
- `/llm`：LLM 可视化（`/llm-viz` 会 301/308 永久重定向到 `/llm`）
- `/cpu`：CPU 仿真（WIP，未暴露）
- `/fluid-sim`：流体仿真

其它目录：`minGPT/`（空，配合 `gen_test_data.py` 生成测试权重时需 symlink 进 Karpathy minGPT）、`emsdk/`（空）、`fonts/`（字体图集，由 `create-font-atlas.jsm` 生成）、`icons/`、`progress/`。

关键点：
- **无需 Odin 工具链即可运行**：`public/native.wasm` 是预编译二进制。仅当修改 `src/llm/wasm/*.odin` 的模型计算逻辑时，才需安装 [Odin](https://odin-lang.org/) + LLVM 的 `lld`/`clang`，再运行 `src/llm/wasm/build.sh` 重新编译。
- **dev 端口为 3002**（`next dev -p 3002`），非默认 3000。
- 本项目用 **yarn** 管理（`yarn.lock` 被 git 跟踪），用 npm 也能跑但会改写 `yarn.lock`。

## 本地部署（安装 / 启动 / 停止 / 清理）

### 1. 安装依赖

```bash
yarn            # 推荐（与仓库 lock 一致）
# 或
npm install     # 可用，但会生成 package-lock.json 并改写 yarn.lock
```

依赖装在项目内 `node_modules/`（约 400M），npm 全局缓存 `~/.npm/`（约 1.4G，所有 npm 项目共享）。不会安装任何全局包。

### 2. 启动

开发模式（端口 3002）：

```bash
yarn dev        # 或 npm run dev
```

后台启动开发模式（npm）：

```bash
cd llm-viz
mkdir -p logs
nohup npm run dev > logs/dev.log 2>&1 &
echo $! > .next-dev.pid
```

查看日志：

```bash
tail -f logs/dev.log
```

浏览器打开 **http://localhost:3002/llm** 查看 LLM 3D 可视化（需支持 WebGL2 的浏览器：新版 Chrome / Edge / Firefox）。
`/` 为主页，`/llm-viz` 会重定向到 `/llm`。

生产构建：

```bash
yarn build && yarn start     # 或 npm run build && npm start
```

### 3. 停止 dev server

前台运行时 `Ctrl+C` 即可。若按上面的 `nohup npm run dev` 后台启动，可用 PID 文件停止：

```bash
kill $(cat .next-dev.pid)
rm .next-dev.pid
```

如果 PID 文件丢失，可按端口停止：

```bash
lsof -ti :3002 | xargs kill
```

### 4. 局域网访问

dev server 默认监听 `0.0.0.0:3002`，局域网内其它机器可直接通过本机 IP 访问：

```
http://<本机局域网IP>:3002/llm
```

如果访问不通但能 ping 通，需放行防火墙：

```bash
sudo ufw allow 3002
# 或
sudo iptables -I INPUT -p tcp --dport 3002 -j ACCEPT
```

### 5. 其它机器部署

在另一台机器上：

```bash
# 1. 拉取代码
git clone <仓库地址>
cd llm-viz

# 2. 安装依赖
yarn          # 或 npm install

# 3. 启动
yarn dev      # 或 npm run dev
```

浏览器打开 `http://<机器IP>:3002/llm` 即可。

无需安装 Odin 编译器（`public/native.wasm` 已随仓库提交），仅需支持 WebGL2 的浏览器。

> **注意**：生产构建 `npm run build` 在 Node.js v22 下可能因 CPU 子项目的 fetch URL 问题报错，与翻译无关。降级到 Node 18 LTS 可解决，或直接用 `yarn dev` 也能正常使用。

### 6. 清理（不再使用本项目时）

**项目内**（删除不影响其它项目）：

```bash
rm -rf node_modules .next package-lock.json
git checkout yarn.lock          # 若用 npm 装过，恢复被改写的 yarn.lock
```

**全局 npm 缓存**（1.4G，所有项目共享；清除后下次任意 npm 项目都要重新下载，仅在不近期使用任何 npm 项目时清理）：

```bash
npm cache clean --force         # 或 rm -rf ~/.npm/_cacache
```
