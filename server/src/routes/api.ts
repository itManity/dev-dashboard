import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { query, queryGameDB } from '../config/database';

const router = Router();

// All API routes require authentication
router.use(isAuthenticated);

// ============================================================
// Dashboard Overview
// ============================================================
router.get('/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    const [accounts, characters, online] = await Promise.all([
      query('SELECT COUNT(*) as count FROM Accounts'),
      queryGameDB('SELECT COUNT(*) as count FROM Characters'),
      queryGameDB("SELECT COUNT(*) as count FROM Characters WHERE LoginStatus = 1"),
    ]);

    res.json({
      totalAccounts: accounts.recordset[0]?.count || 0,
      totalCharacters: characters.recordset[0]?.count || 0,
      onlinePlayers: online.recordset[0]?.count || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: (err as Error).message });
  }
});

// ============================================================
// Accounts
// ============================================================
router.get('/accounts', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: Record<string, unknown> = {};

    if (search) {
      whereClause = 'WHERE AccountName LIKE @search';
      params.search = `%${search}%`;
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM Accounts ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT AccountName, CreateDate, LastLoginDate, Cash
       FROM Accounts ${whereClause}
       ORDER BY CreateDate DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      { ...params, offset, limit }
    );

    res.json({
      data: result.recordset,
      total: countResult.recordset[0]?.total || 0,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accounts', details: (err as Error).message });
  }
});

router.get('/accounts/:accountName', async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT AccountName, CreateDate, LastLoginDate, Cash FROM Accounts WHERE AccountName = @name',
      { name: req.params.accountName }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account', details: (err as Error).message });
  }
});

// ============================================================
// Characters
// ============================================================
router.get('/characters', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: Record<string, unknown> = {};

    if (search) {
      whereClause = 'WHERE CharacterName LIKE @search';
      params.search = `%${search}%`;
    }

    const countResult = await queryGameDB(
      `SELECT COUNT(*) as total FROM Characters ${whereClause}`,
      params
    );

    const result = await queryGameDB(
      `SELECT CharacterID, CharacterName, AccountName, CharacterClass,
              CharacterLevel, CurHP, CurMP, Money, CreateDate, LastLoginDate, LoginStatus
       FROM Characters ${whereClause}
       ORDER BY CharacterLevel DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      { ...params, offset, limit }
    );

    res.json({
      data: result.recordset,
      total: countResult.recordset[0]?.total || 0,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch characters', details: (err as Error).message });
  }
});

router.get('/characters/:id', async (req: Request, res: Response) => {
  try {
    const result = await queryGameDB(
      `SELECT CharacterID, CharacterName, AccountName, CharacterClass,
              CharacterLevel, CurHP, CurMP, Money, CreateDate, LastLoginDate, LoginStatus
       FROM Characters WHERE CharacterID = @id`,
      { id: parseInt(req.params.id) }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch character', details: (err as Error).message });
  }
});

// ============================================================
// Items / Inventory
// ============================================================
router.get('/characters/:id/inventory', async (req: Request, res: Response) => {
  try {
    const result = await queryGameDB(
      `SELECT ItemID, ItemName, Quantity, EnhanceLevel, SlotNo
       FROM Items WHERE OwnerID = @id
       ORDER BY SlotNo ASC`,
      { id: parseInt(req.params.id) }
    );

    res.json({ data: result.recordset });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory', details: (err as Error).message });
  }
});

// ============================================================
// Game Logs
// ============================================================
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const type = req.query.type as string || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: Record<string, unknown> = {};

    if (type) {
      whereClause = 'WHERE LogType = @type';
      params.type = type;
    }

    const result = await queryGameDB(
      `SELECT LogID, LogType, LogMessage, CharacterName, LogDate
       FROM GameLog ${whereClause}
       ORDER BY LogDate DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      { ...params, offset, limit }
    );

    res.json({
      data: result.recordset,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs', details: (err as Error).message });
  }
});

// ============================================================
// Server Management
// ============================================================
router.get('/server/status', async (_req: Request, res: Response) => {
  try {
    const online = await queryGameDB("SELECT COUNT(*) as count FROM Characters WHERE LoginStatus = 1");
    res.json({
      status: 'running',
      onlinePlayers: online.recordset[0]?.count || 0,
      uptime: process.uptime(),
    });
  } catch (err) {
    res.json({
      status: 'database_unreachable',
      onlinePlayers: 0,
      uptime: process.uptime(),
    });
  }
});

export default router;
