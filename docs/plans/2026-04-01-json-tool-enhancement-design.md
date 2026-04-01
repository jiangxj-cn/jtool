# JSON 工具增强设计文档

## 当前状态

### 已有功能 ✅
1. **JSON 格式化** - 使用 JSON5.parse + JSON.stringify
2. **JSON 校验** - 验证 JSON 有效性
3. **JSON 压缩** - 移除空格和换行
4. **字符串转义/去转义** - 基础转义功能
5. **全部转义/去转义** - 处理所有特殊字符

### 技术栈
- **Core**: TypeScript, JSON5
- **UI**: Vue 3 + Naive UI
- **架构**: Monorepo (packages/core + src)

---

## 需求分析

### 高优先级功能

#### 1. JSON 路径查询 (JSONPath)
**需求**: 支持 `$.store.book[*].author` 语法查询 JSON 数据
**实现要点**:
- 需要 JSONPath 解析库 (jsonpath-plus 或类似)
- 支持基本语法: `$`, `.`, `[*]`, `[n]`, `..`
- 高亮显示匹配结果
- 显示查询路径和结果

#### 2. JSON 转义增强
**需求**: 支持多种编程语言和场景的转义
**实现要点**:
- MyBatis SQL 打印转义
- Java 字符串转义
- Go 字符串转义
- Python 字符串转义
- JavaScript 转义

### 中优先级功能

#### 3. JSON 转其他格式
**需求**: 将 JSON 转换为其他常用格式
**实现要点**:
- JSON → XML (需要处理嵌套和数组)
- JSON → YAML (使用 js-yaml 库)
- JSON → CSV (处理扁平化和嵌套)
- JSON → JavaScript 对象 (字面量格式)

#### 4. 其他格式转 JSON
**需求**: 将其他格式转换为 JSON
**实现要点**:
- XML → JSON (xml-js 库)
- YAML → JSON (js-yaml 库)
- CSV → JSON (papaparse 或手动解析)

### 低优先级功能

#### 5. JSON 比较
**需求**: 对比两个 JSON 文件的差异
**实现要点**:
- 并排显示两个 JSON
- 高亮差异 (新增、删除、修改)
- 使用 diff 算法 (deep-diff 或 jsondiffpatch)

#### 6. JSON 树形视图
**需求**: 可交互的树形结构展示
**实现要点**:
- 可折叠/展开节点
- 节点搜索功能
- 路径复制 (点击节点复制 JSONPath)
- 语法高亮

---

## 设计方案

### 架构设计

```
packages/core/src/json/
├── index.ts              # 导出所有 JSON 工具函数
├── format.ts             # 格式化、校验、压缩
├── escape.ts             # 转义相关
├── jsonpath.ts           # JSONPath 查询 (新增)
├── convert.ts            # 格式转换 (新增)
└── diff.ts               # JSON 比较 (新增)

src/components/json/
└── JsonTool.vue          # 主组件，包含所有功能
```

### UI 设计

采用 Tab 切换不同功能模块:
```
[格式化] [JSONPath] [转换] [比较] [转义] [树形视图]
```

### 依赖库选择

```json
{
  "dependencies": {
    "jsonpath-plus": "^10.0.0",    // JSONPath 查询
    "js-yaml": "^4.1.0",           // YAML 转换
    "xml-js": "^1.6.11",           // XML 转换
    "jsondiffpatch": "^0.6.0",     // JSON 比较
    "papaparse": "^5.4.0"          // CSV 解析
  }
}
```

---

## 实现计划

### Phase 1: 高优先级 (核心功能)
1. 安装依赖库
2. 实现 JSONPath 查询功能
3. 实现多语言转义增强

### Phase 2: 中优先级 (格式转换)
4. 实现 JSON → XML/YAML/CSV/JS
5. 实现 XML/YAML/CSV → JSON

### Phase 3: 低优先级 (高级功能)
6. 实现 JSON 比较功能
7. 实现 JSON 树形视图

### Phase 4: 优化与测试
8. UI 优化和响应式调整
9. 添加单元测试
10. 文档更新

---

## 技术细节

### JSONPath 实现
```typescript
import { JSONPath } from 'jsonpath-plus'

export function jsonPathQuery(json: string, path: string): JsonResult {
  try {
    const obj = JSON5.parse(json)
    const result = JSONPath({ path, json: obj })
    return {
      success: true,
      result: JSON.stringify(result, null, 2)
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '查询失败'
    }
  }
}
```

### 格式转换实现
```typescript
import jsYaml from 'js-yaml'
import { xml2js, js2xml } from 'xml-js'

export function jsonToYaml(json: string): JsonResult {
  try {
    const obj = JSON5.parse(json)
    const yaml = jsYaml.dump(obj)
    return { success: true, result: yaml }
  } catch (error) {
    return { success: false, error: '转换失败' }
  }
}
```

### 转义增强实现
```typescript
export function jsonEscapeForLanguage(json: string, lang: 'java' | 'go' | 'python' | 'mybatis'): string {
  const escaped = JSON.stringify(json)
  
  switch (lang) {
    case 'java':
      return escaped.replace(/"/g, '\\"')
    case 'go':
      return '`' + escaped + '`'
    case 'python':
      return '"""' + escaped + '"""'
    case 'mybatis':
      return escaped.replace(/'/g, "''") // SQL 转义
    default:
      return escaped
  }
}
```

---

## 测试策略

### 单元测试
- 每个工具函数独立测试
- 边界条件测试 (空输入、无效输入)
- 转换往返测试 (JSON→YAML→JSON)

### 集成测试
- UI 组件交互测试
- 端到端功能测试

---

## 成功标准

1. ✅ 所有 6 个功能模块实现完成
2. ✅ 通过所有单元测试
3. ✅ UI 响应式，支持移动端
4. ✅ 性能良好 (大 JSON 处理 < 1s)
5. ✅ 代码质量 (ESLint 无警告)
6. ✅ Git commit & push 完成

---

## 风险与挑战

1. **JSONPath 复杂性**: 完整 JSONPath 语法复杂，先实现常用子集
2. **CSV 转换**: 嵌套 JSON 转 CSV 有歧义，需要明确规则
3. **大文件性能**: 超大 JSON 可能影响性能，考虑流式处理
4. **UI 复杂度**: 功能增多可能导致 UI 混乱，需要良好组织

---

*文档创建时间：2026-04-01*
*最后更新：2026-04-01*
