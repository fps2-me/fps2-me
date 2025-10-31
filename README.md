# fps2.me - 香港转数快 FPS 二维码生成器

这是一个基于 Next.js 和 Tailwind CSS 构建的现代化 Web 应用，旨在为用户提供一个简洁、快速且免费的香港转数快（FPS）收款二维码生成服务。

访问线上应用： [<sup>1</sup>](https://fps2.me/qr-generator)

## ✨ 主要功能

- **多标识支持**: 用户可以使用 **FPS ID (转数快识别码)**、**手机号码**或**电子邮箱**来生成二维码。
- **动态二维码生成**: 在浏览器端实时生成 QR 码，无需后端服务器处理敏感信息，保障用户隐私。
- **自定义品牌 Logo**:
  - 应用启动时，会动态地使用 HTML Canvas API 将文本 `fps2.me` 渲染成一张图片 Logo。
  - 将这个动态生成的 Logo 嵌入到 QR 码的中心。
- **高容错率**: QR 码使用最高的容错等级（Level "H"），确保即使中心有 Logo 遮挡，二维码依然可以被轻松扫描。
- **友好的用户界面**:
  - 使用 Tailwind CSS 构建了干净、响应式的界面。
  - 支持明亮和暗黑两种模式（Light/Dark Mode）。
  - 包含清晰的加载状态和输入提示。
- **简洁的 URL**: 提供一个易于记忆的短链接 `/qr`，可直接跳转到生成器页面。

## 🛠️ 技术栈

- **框架**: [<sup>2</sup>](https://nextjs.org/) (App Router)
- **UI 库**: React [<sup>3</sup>](https://reactjs.org/)
- **语言**: TypeScript [<sup>4</sup>](https://www.typescriptlang.org/)
- **样式**: Tailwind CSS [<sup>5</sup>](https://tailwindcss.com/)
- **QR 码生成**: `qrcode.react` [<sup>6</sup>](https://github.com/zpao/qrcode.react)
- **FPS 逻辑**: `hkqr-fps` (一个处理香港转数快编码标准的本地库)
- **图标**: `lucide-react` [<sup>7</sup>](https://lucide.dev/)

## 📁 项目结构

项目基于 Next.js 的 App Router 构建，关键文件如下：

- `app/page.tsx`: 项目的首页/落地页，对项目进行简单介绍并提供指向生成器的链接。
- `app/qr-generator/page.tsx`: **核心页面**。包含了生成 QR 码的所有UI和业务逻辑，包括表单、状态管理和二维码渲染。
- `app/qr/page.tsx`: 一个简单的客户端组件，用于实现从 `/qr` 这个友好路径到实际生成器页面的**重定向**。

## ⚙️ 实现原理

### 1. 核心 QR 字符串生成

- 项目依赖一个名为 `hkqr-fps` 的本地库。
- 当用户点击“生成二维码”时，应用会根据用户选择的标识类型（FPS ID、手机或邮箱）和输入的值，调用 `hkqr-fps` 库。
- 该库遵循香港金融管理局制定的《共用二维码标准》，将商户信息（本项目中设为 "NA"）、交易信息和用户账户标识等数据打包成一个符合规范的字符串（Payload）。

### 2. 动态 Logo 生成

这是一个有趣的小技巧，它避免了在项目中存储静态图片资源。

- 在 `qr-generator/page.tsx` 组件中，`useEffect` Hook 会在组件首次加载时运行一次。
- 它在内存中创建一个 `<canvas>` 元素。
- 使用 Canvas 2D API，将文本 `fps2.me` 绘制到这个 canvas 上，并可以自定义字体、颜色和尺寸。
- 最后，调用 `canvas.toDataURL('image/png')` 将绘制好的内容转换成 Base64 格式的图片数据，并存储在 React state (`logoImage`) 中。

```javascript
// src/app/qr-generator/page.tsx
useEffect(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const text = "fps2.me";
    ctx.font = "bold 26px Arial";
    // ... 绘制逻辑 ...
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    setLogoImage(canvas.toDataURL('image/png'));
  }
}, []);
```

### 3. 带 Logo 的 QR 码渲染

- 本项目使用 `qrcode.react` 的 `<QRCodeCanvas>` 组件来渲染二维码。
- 为了嵌入 Logo，我们对它进行了如下配置：
  - `level={'H'}`: 设置容错级别为最高 (High)。这意味着 QR 码中最多 30% 的数据可以被损坏或遮挡，但仍然可以被读取。这是嵌入 Logo 的关键。
  - `imageSettings`: 这是一个配置对象，用于控制嵌入的图片。
    - `src`: 传入我们在上一步动态生成的 `logoImage` (Base64 Data URL)。
    - `height` 和 `width`: 定义 Logo 在 QR 码中的显示尺寸。
    - `excavate: true`: **极其重要**。此选项会在 Logo 周围“挖空”一个区域，清除掉 Logo 背景下的 QR 码方块，确保 Logo 不会与 QR 码的数据点重叠，从而提高扫描成功率。

```jsx
// src/app/qr-generator/page.tsx
<QRCodeCanvas 
  value={finalQrString} 
  size={256} 
  level={"H"}
  imageSettings={{
    src: logoImage,
    height: 24,
    width: 120,
    excavate: true,
  }}
/>
```

## 🚀 如何开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/fps2-me.git
    cd fps2-me
    ```

2.  **安装依赖**
    项目依赖一个本地包 `hkqr-fps`。请确保它已正确配置在 `package.json` 中（例如使用 `file:` 协议），然后正常安装所有依赖。
    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  **运行开发服务器**
    ```bash
    npm run dev
    # 或者
    yarn dev
    ```
    现在，在浏览器中打开 `http://localhost:3000` 即可看到项目主页。


