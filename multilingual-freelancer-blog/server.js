import express from 'express';
import cors from 'cors';
import { ContentApi } from './src/api/content-api.ts';

const app = express();
const PORT = 3003;

// 中间件
app.use(cors());
app.use(express.json());

// 内容相关路由

// GET /api/contents - 获取内容列表
app.get('/api/contents', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, language, published } = req.query;
    
    if (published === 'true') {
      const contents = await ContentApi.getAllPublishedContents(language);
      res.json(contents);
    } else {
      const result = await ContentApi.getPaginatedContents(
        parseInt(page),
        parseInt(pageSize),
        language
      );
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contents/:id - 根据ID获取内容
app.get('/api/contents/:id', async (req, res) => {
  try {
    const content = await ContentApi.getContentById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contents/slug/:slug - 根据slug获取内容
app.get('/api/contents/slug/:slug', async (req, res) => {
  try {
    const content = await ContentApi.getContentBySlug(req.params.slug);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by slug:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contents/:id/translations/:language - 获取内容翻译
app.get('/api/contents/:id/translations/:language', async (req, res) => {
  try {
    const translation = await ContentApi.getContentTranslation(
      req.params.id,
      req.params.language
    );
    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }
    res.json(translation);
  } catch (error) {
    console.error('Error fetching content translation:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contents/:id/related - 获取相关内容
app.get('/api/contents/:id/related', async (req, res) => {
  try {
    const { language, limit = 5 } = req.query;
    const contents = await ContentApi.getRelatedContents(
      req.params.id,
      language,
      parseInt(limit)
    );
    res.json(contents);
  } catch (error) {
    console.error('Error fetching related contents:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contents - 创建内容
app.post('/api/contents', async (req, res) => {
  try {
    const { userId, slug, defaultLanguage, published = false } = req.body;
    const content = await ContentApi.createContent(
      userId,
      slug,
      defaultLanguage,
      published
    );
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contents/:id/translations - 创建内容翻译
app.post('/api/contents/:id/translations', async (req, res) => {
  try {
    const { language, title, content, seoMetadata } = req.body;
    const translation = await ContentApi.createContentTranslation(
      req.params.id,
      language,
      {
        title,
        content,
        seoMetadata
      }
    );
    res.status(201).json(translation);
  } catch (error) {
    console.error('Error creating content translation:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/contents/:id - 更新内容
app.put('/api/contents/:id', async (req, res) => {
  try {
    const content = await ContentApi.updateContent(req.params.id, req.body);
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/contents/:id/translations/:language - 更新内容翻译
app.put('/api/contents/:id/translations/:language', async (req, res) => {
  try {
    const translation = await ContentApi.updateContentTranslation(
      req.params.id,
      req.params.language,
      req.body
    );
    res.json(translation);
  } catch (error) {
    console.error('Error updating content translation:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/contents/:id - 删除内容
app.delete('/api/contents/:id', async (req, res) => {
  try {
    const success = await ContentApi.deleteContent(req.params.id);
    res.json({ success });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/contents/:id/translations/:language - 删除内容翻译
app.delete('/api/contents/:id/translations/:language', async (req, res) => {
  try {
    const success = await ContentApi.deleteContentTranslation(
      req.params.id,
      req.params.language
    );
    res.json({ success });
  } catch (error) {
    console.error('Error deleting content translation:', error);
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});