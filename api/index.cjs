'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('../models/index.cjs');

dotenv.config();

const app = express();

// CORS – allow same-origin in prod (Vercel serves frontend + API together)
// and localhost in dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,        // set this in Vercel env vars if ever needed
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // permissive – tighten in production if needed
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ──────────────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// ──────────────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────────────
app.get('/api/hero', async (req, res) => {
  try {
    let hero = await db.Portfolio.findOne();
    if (!hero) {
      hero = await db.Portfolio.create({
        name: 'Your Name',
        title: 'Full Stack Developer',
        description: 'I craft beautiful, high-performance web applications that blend stunning design with clean, scalable code.',
        freelance: 'Available for freelance work',
        statusBadge: 'Open to work 🚀',
      });
    }
    const stats = await db.Stat.findAll({ order: [['id', 'ASC']] });
    res.json({ ...hero.toJSON(), stats });
  } catch (error) {
    console.error('[GET /api/hero]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero', async (req, res) => {
  try {
    const { stats, ...heroData } = req.body;
    let hero = await db.Portfolio.findOne();

    if (hero) {
      await hero.update(heroData);
    } else {
      hero = await db.Portfolio.create(heroData);
    }

    if (stats && Array.isArray(stats)) {
      await db.Stat.destroy({ where: {} });
      if (stats.length > 0) {
        await db.Stat.bulkCreate(stats.map(s => ({ label: s.label, value: s.value })));
      }
    }

    const newStats = await db.Stat.findAll({ order: [['id', 'ASC']] });
    res.json({ ...hero.toJSON(), stats: newStats });
  } catch (error) {
    console.error('[POST /api/hero]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────
// ABOUT
// ──────────────────────────────────────────────────────
app.get('/api/about', async (req, res) => {
  try {
    const portfolio = await db.Portfolio.findOne();
    const highlights = await db.Highlight.findAll({ order: [['id', 'ASC']] });
    const timelines = await db.Timeline.findAll({ order: [['id', 'DESC']] });
    res.json({
      heading: portfolio?.aboutHeading || '',
      bio1: portfolio?.aboutBio1 || '',
      bio2: portfolio?.aboutBio2 || '',
      bio3: portfolio?.aboutBio3 || '',
      resumeUrl: portfolio?.resumeUrl || '',
      highlights,
      timeline: timelines
    });
  } catch (error) {
    console.error('[GET /api/about]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/about', async (req, res) => {
  try {
    const { heading, bio1, bio2, bio3, resumeUrl, highlights, timeline } = req.body;
    let portfolio = await db.Portfolio.findOne();

    const data = { aboutHeading: heading, aboutBio1: bio1, aboutBio2: bio2, aboutBio3: bio3, resumeUrl };
    if (portfolio) {
      await portfolio.update(data);
    } else {
      portfolio = await db.Portfolio.create(data);
    }

    if (highlights && Array.isArray(highlights)) {
      await db.Highlight.destroy({ where: {} });
      if (highlights.length > 0) {
        await db.Highlight.bulkCreate(highlights.map(h => ({ title: h.title, description: h.description })));
      }
    }

    if (timeline && Array.isArray(timeline)) {
      await db.Timeline.destroy({ where: {} });
      if (timeline.length > 0) {
        await db.Timeline.bulkCreate(timeline.map(t => ({ year: t.year, role: t.role, company: t.company })));
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[POST /api/about]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────
// SKILLS
// ──────────────────────────────────────────────────────
app.get('/api/skills', async (req, res) => {
  try {
    const portfolio = await db.Portfolio.findOne();
    const categories = await db.SkillCategory.findAll({
      include: [{ model: db.Skill, as: 'skills' }],
      order: [['id', 'ASC']]
    });
    categories.forEach(cat => cat.skills.sort((a, b) => a.id - b.id));

    res.json({
      heading: portfolio?.skillsHeading || '',
      description: portfolio?.skillsDescription || '',
      techBadges: portfolio?.techBadges || [],
      categories
    });
  } catch (error) {
    console.error('[GET /api/skills]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    const { heading, description, techBadges, categories } = req.body;

    let portfolio = await db.Portfolio.findOne();
    if (portfolio) {
      await portfolio.update({ skillsHeading: heading, skillsDescription: description, techBadges });
    } else {
      await db.Portfolio.create({ skillsHeading: heading, skillsDescription: description, techBadges });
    }

    await db.Skill.destroy({ where: {} });
    await db.SkillCategory.destroy({ where: {} });

    if (categories && Array.isArray(categories)) {
      for (const cat of categories) {
        const createdCat = await db.SkillCategory.create({
          label: cat.label,
          colorClass: cat.colorClass
        });
        if (cat.skills && cat.skills.length > 0) {
          await db.Skill.bulkCreate(
            cat.skills.map(s => ({
              name: s.name,
              level: s.level,
              categoryId: createdCat.id
            }))
          );
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[POST /api/skills]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────
// PROJECTS
// ──────────────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const portfolio = await db.Portfolio.findOne();
    const projects = await db.Project.findAll({ order: [['id', 'DESC']] });
    res.json({
      heading: portfolio?.projectsHeading || '',
      description: portfolio?.projectsDescription || '',
      projects
    });
  } catch (error) {
    console.error('[GET /api/projects]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { heading, description, projects } = req.body;

    let portfolio = await db.Portfolio.findOne();
    if (portfolio) {
      await portfolio.update({ projectsHeading: heading, projectsDescription: description });
    } else {
      await db.Portfolio.create({ projectsHeading: heading, projectsDescription: description });
    }

    await db.Project.destroy({ where: {} });
    if (projects && Array.isArray(projects)) {
      await db.Project.bulkCreate(
        projects.map(p => ({
          title: p.title,
          category: p.category,
          description: p.description,
          image: p.image,
          tags: p.tags,
          link: p.link,
          github: p.github
        }))
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error('[POST /api/projects]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────
// CONTACT MESSAGES
// ──────────────────────────────────────────────────────
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('[GET /api/messages]', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    const created = await db.Message.create({ name, email, subject, message });
    res.status(201).json(created);
  } catch (error) {
    console.error('[POST /api/messages]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Mark a message as read
app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    const msg = await db.Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    await msg.update({ isRead: true });
    res.json(msg);
  } catch (error) {
    console.error('[PATCH /api/messages/:id/read]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const msg = await db.Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    await msg.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/messages/:id]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────
// Vercel Serverless Export
// ──────────────────────────────────────────────────────
module.exports = app;

// Local Development Server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}
