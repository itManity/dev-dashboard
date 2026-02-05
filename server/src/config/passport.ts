import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// passport-discord doesn't have great types, so we use require
const DiscordStrategy = require('passport-discord').Strategy;

export interface AdminUser {
  id: string;
  provider: 'google' | 'discord';
  email: string;
  displayName: string;
  avatar?: string;
}

const allowedAdmins = (process.env.ALLOWED_ADMINS || '').split(',').map(e => e.trim().toLowerCase());

function isAllowedAdmin(email: string): boolean {
  if (allowedAdmins.length === 0 || (allowedAdmins.length === 1 && allowedAdmins[0] === '')) {
    return true; // Allow all if no restriction set
  }
  return allowedAdmins.includes(email.toLowerCase());
}

export function configurePassport() {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: AdminUser, done) => {
    done(null, user);
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    }, (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value || '';

      if (!isAllowedAdmin(email)) {
        return done(null, false, { message: 'Not authorized as admin' });
      }

      const user: AdminUser = {
        id: profile.id,
        provider: 'google',
        email,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
      };

      return done(null, user);
    }));
    console.log('[Auth] Google OAuth strategy configured');
  } else {
    console.warn('[Auth] Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  // Discord OAuth Strategy
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    passport.use(new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL || '/auth/discord/callback',
      scope: ['identify', 'email'],
    }, (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      const email = profile.email || '';

      if (!isAllowedAdmin(email)) {
        return done(null, false, { message: 'Not authorized as admin' });
      }

      const user: AdminUser = {
        id: profile.id,
        provider: 'discord',
        email,
        displayName: profile.username,
        avatar: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : undefined,
      };

      return done(null, user);
    }));
    console.log('[Auth] Discord OAuth strategy configured');
  } else {
    console.warn('[Auth] Discord OAuth not configured - missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET');
  }
}
