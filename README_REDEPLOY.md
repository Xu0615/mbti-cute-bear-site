# 一二和布布 熊格站点重新上线说明

## 当前已完成改造

- 全站主题重做为「一二和布布」
- 开场必须先选择角色：一二（女熊向）/布布（男熊向）
- 两套独立题库：各 30 题、每题 4 个选项
- 最终结果改为 MBTI 熊格：
  - 一二 16 种熊格
  - 布布 16 种熊格
- 新增跨角色匹配度计算
- 分享链接支持直达结果页（带 role/type/name 参数）

## 需要上传到仓库的文件（覆盖旧文件）

目录：`G:\MBTI\mbti-cute-test-deploy`

请上传并覆盖以下文件：

- `index.html`
- `styles.css`
- `app.js`
- `bubu.png`
- `yier.png`
- `data/questions.js`
- `data/personalities.js`

## GitHub 网页端重新上线步骤（不需要 cmd）

1. 打开仓库：`https://github.com/Xu0615/mbti-cute-bear-site`
2. 点击 `Add file` -> `Upload files`
3. 把上面 7 个文件（含 `data` 文件夹内两个 js）拖进去
4. 如弹出同名文件提示，选择覆盖（Replace）
5. 点击 `Commit changes`
6. 打开 `Settings` -> `Pages`
7. 确认：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
8. 保存后等待 1~3 分钟
9. 访问正式链接：`https://xu0615.github.io/mbti-cute-bear-site/`

## 本地预览（可选）

```powershell
cd G:\MBTI\mbti-cute-test-deploy
py -m http.server 8080
```

浏览器打开：`http://localhost:8080`

## 验收清单

- 首页可看到一二/布布角色选择卡
- 选一二后是 30 题，选布布后也是 30 题，且题目内容不同
- 结果显示「熊格代号 + 熊格名称 + 详细描述」
- 可选择对方熊格并计算匹配度
- 复制分享链接后，别人可直接打开结果页
