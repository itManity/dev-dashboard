import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  (_req, res) => {
    res.redirect('/');
  }
);

// Discord OAuth
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/?error=auth_failed' }),
  (_req, res) => {
    res.redirect('/');
  }
);

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

export default router;
