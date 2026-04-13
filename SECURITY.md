# 🔒 Security Guide - MedGenius AI

## ⚠️ IMPORTANT: API Keys and Secrets

### Never Commit Secrets to Git!

Your `.env` files contain sensitive information and should **NEVER** be committed to version control.

### What's Protected

The following files are in `.gitignore` and will not be committed:
- `.env`
- `backend/.env`
- `.env.local`
- `.env.*.local`

### Setup for New Developers

1. Copy the example files:
```bash
# Root directory
cp .env.example .env

# Backend directory
cp backend/.env.example backend/.env
```

2. Fill in your actual values:
   - Get Groq API key from: https://console.groq.com/
   - Get MongoDB URI from: https://cloud.mongodb.com/
   - Generate JWT secret: `node backend/generate-key.js`

### Current API Keys Used

✅ **ACTIVELY USED**:
- `GROQ_API_KEY` - Primary AI engine (LLaMA 3.3 70B)
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication

❌ **NOT USED** (defined but not implemented):
- `VITE_GEMINI_API_KEY` - Google Gemini (backup option)
- `VITE_OPENAI_API_KEY` - OpenAI (backup option)

### If You Accidentally Committed Secrets

1. **Immediately revoke/regenerate** the exposed keys:
   - Groq: https://console.groq.com/keys
   - MongoDB: https://cloud.mongodb.com/
   
2. **Remove from Git history**:
```bash
# Remove the file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

3. **Update your local .env** with new keys

### GitHub Push Protection

GitHub automatically scans for secrets in commits. If blocked:

1. **DO NOT** use the "allow secret" option
2. **Remove the secret** from the commit
3. **Regenerate the key** on the service provider
4. **Update your local .env** file

### Best Practices

✅ **DO**:
- Use `.env.example` files with placeholder values
- Keep actual `.env` files local only
- Rotate keys regularly
- Use different keys for dev/staging/production
- Store production keys in secure vaults (AWS Secrets Manager, etc.)

❌ **DON'T**:
- Commit `.env` files
- Share keys in chat/email
- Use production keys in development
- Hardcode secrets in source code
- Push secrets to public repositories

### Environment Variables Documentation

Create documentation that shows:
- Which variables are required
- Where to get the values
- Example formats (without actual values)

Example:
```env
# Get from https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Checking for Exposed Secrets

Before pushing:
```bash
# Check what will be committed
git diff --cached

# Search for potential secrets
git diff --cached | grep -i "api_key\|secret\|password"
```

### Production Deployment

For production:
1. Use environment variables from hosting platform
2. Never store secrets in code
3. Use secret management services
4. Enable secret scanning on GitHub
5. Regular security audits

### Contact

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email: security@medgenius.ai
- Include: description, steps to reproduce, impact

---

**Last Updated**: April 13, 2026
**Status**: Active Protection ✅
