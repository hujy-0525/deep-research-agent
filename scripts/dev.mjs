import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('web');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const now = () => new Date().toISOString();
const mockJob = topic => ({
  id: 'preview-research', topic, status: 'completed', depth: 'standard', updatedAt: now(),
  tasks: [
    { title: '梳理核心概念与研究边界', intent: '建立问题框架，明确分析口径与关键变量。', query: `${topic} 核心概念 研究框架`, status: 'completed', summary: '已完成概念定义、边界识别与关键变量梳理，形成可供后续检索验证的研究框架。' },
    { title: '检索权威证据与行业资料', intent: '优先寻找一手来源、研究报告和可核验数据。', query: `${topic} 官方报告 最新数据`, status: 'completed', summary: '已检索多类可信来源，交叉核对关键数据，并记录来源与访问时间。' },
    { title: '分析趋势、分歧与潜在风险', intent: '比较不同观点，找出共识、分歧和证据缺口。', query: `${topic} 趋势 风险 争议`, status: 'completed', summary: '已对主要观点进行归纳，标注证据强弱，并识别需要谨慎解释的结论。' }
  ],
  sources: [
    { id: 1, title: '权威资料：主题概览与关键事实', url: 'https://example.com/research/overview', accessedAt: now() },
    { id: 2, title: '行业研究：趋势与数据观察', url: 'https://example.com/research/trends', accessedAt: now() },
    { id: 3, title: '方法说明：证据质量与交叉验证', url: 'https://example.com/research/method', accessedAt: now() }
  ],
  logs: [
    { at: now(), message: 'Planner 已生成 3 项研究任务' },
    { at: now(), message: 'SearchTool 已完成多轮网络检索' },
    { at: now(), message: 'Summarizer 与 NoteTool 已整理研究笔记' },
    { at: now(), message: 'Report Writer 已生成最终报告' }
  ],
  agents: [
    { name: 'TODO Planner', role: '研究计划与任务拆分', status: 'completed', message: '计划质量门已通过' },
    { name: 'Task Summarizer', role: '证据归纳与笔记沉淀', status: 'completed', message: '3 项任务均已总结' },
    { name: 'Report Writer', role: '报告组织与引用整合', status: 'completed', message: '最终报告已生成' }
  ],
  planQuality: { valid: true, coverage: 'passed', logic: 'passed', queryQuality: 'passed' },
  report: `# ${topic}\n\n## 执行摘要\n\n本次研究通过任务规划、网络检索、证据归纳、反思补充与报告写作五个阶段完成。当前证据能够支持主要判断，同时对不确定信息保留了明确边界。\n\n## 核心发现\n\n- 研究问题可以拆分为概念边界、权威证据和趋势风险三类任务。\n- 多来源交叉验证能够显著降低单一资料带来的偏差。\n- 对存在分歧的结论，应同时展示证据强度和适用条件。\n\n## 结论\n\n该工作台已完整展示多智能体协作链路及可追溯研究产物。[查看示例来源](https://example.com/research/overview)`
});

http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/research/status') {
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ configured: true, storage: true }));
    }
    if (req.url === '/api/research/jobs') {
      res.setHeader('content-type', 'application/json');
      return res.end('{"jobs":[]}');
    }
    if (req.url === '/api/research/stream' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const input = JSON.parse(body || '{}');
      const job = mockJob(input.topic || '深度研究主题');
      res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache' });
      res.end(`event: status\ndata: ${JSON.stringify({ message: '多智能体协作链路已完成' })}\n\nevent: result\ndata: ${JSON.stringify({ job })}\n\n`);
      return;
    }
    const requestPath = req.url === '/' ? 'index.html' : req.url.split('?')[0].replace(/^\//, '');
    const filePath = path.join(root, requestPath);
    if (!filePath.startsWith(root)) throw Error('invalid path');
    const body = await readFile(filePath);
    res.setHeader('content-type', types[path.extname(filePath)] || 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(process.env.PORT || 4173, '0.0.0.0');
