# NextGenHelper AI - Deployment Guide

## 🚀 Pre-Deployment Checklist

### Environment Setup

- [ ] All environment variables configured for production
- [ ] Razorpay keys switched to live mode (if ready for production payments)
- [ ] Google OAuth domain configured for production URL
- [ ] Convex database deployed to production
- [ ] Domain/subdomain configured

### Code Quality

- [ ] Run `npm run lint` - Fix any linting errors
- [ ] Run `npm run type-check` - Fix any TypeScript errors
- [ ] Run `npm run build` - Ensure build succeeds
- [ ] Test all major features in development

## 🌐 Platform-Specific Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain

4. **Domain Setup (Optional)**
   - Add custom domain in Vercel dashboard
   - Update Google OAuth settings with new domain

### Option 2: Railway

1. **Connect Repository**

   - Go to Railway.app
   - Connect your GitHub repository

2. **Configure Build**

   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Port: 3000

3. **Set Environment Variables**
   - Add all variables from `.env.example`
   - Set `NEXT_PUBLIC_SITE_URL` to your Railway domain

### Option 3: Netlify

1. **Build Settings**

   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.example`

## 🔧 Post-Deployment Setup

### 1. Update Google OAuth

- Go to [Google Console](https://console.developers.google.com/)
- Add your production domain to authorized origins
- Update redirect URIs

### 2. Test Payment Flow

- Test with Razorpay test mode first
- Verify webhook endpoints (if using webhooks)
- Switch to live mode when ready

### 3. Database Migration

- Ensure Convex is deployed to production
- Verify all mutations and queries work
- Check data consistency

## ✅ Post-Deployment Testing

### Critical Features to Test

- [ ] User authentication (sign up/sign in)
- [ ] AI model responses from all providers
- [ ] Payment flow (test mode first!)
- [ ] Subscription management and cancellation
- [ ] Credit tracking and limits
- [ ] Mobile responsiveness
- [ ] Dark/light mode switching
- [ ] Assistant creation and editing
- [ ] Chat history and context

### Health Check

- Visit `https://yourdomain.com/api/health`
- Should return JSON with status "healthy"

### Performance Testing

- Test loading speeds
- Check mobile experience
- Verify image optimization
- Test under load (if possible)

## 📊 Monitoring & Analytics

### Essential Monitoring

- Set up uptime monitoring (Pingdom, UptimeRobot)
- Configure error tracking (Sentry recommended)
- Monitor API rate limits
- Track user engagement

### Optional Analytics

- Google Analytics
- PostHog for product analytics
- Mixpanel for user behavior

## 🔒 Security Checklist

- [ ] Environment variables properly secured
- [ ] API endpoints protected with rate limiting
- [ ] User authentication working correctly
- [ ] CORS policies configured
- [ ] HTTPS enabled
- [ ] Security headers configured (already done in next.config.ts)

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check TypeScript errors: `npm run type-check`
   - Verify all imports are correct
   - Ensure environment variables are set

2. **Authentication Issues**

   - Verify Google OAuth settings
   - Check NEXT_PUBLIC_SITE_URL matches deployment URL
   - Confirm redirect URIs are correct

3. **Database Connection**

   - Verify NEXT_PUBLIC_CONVEX_URL is correct
   - Check Convex deployment status
   - Test with `/api/health` endpoint

4. **Payment Issues**
   - Verify Razorpay keys are correct for environment
   - Check webhook configurations
   - Test with small amounts first

## 📈 Performance Optimization

### Already Implemented

- ✅ Image optimization
- ✅ Bundle optimization
- ✅ Security headers
- ✅ Rate limiting
- ✅ Error handling
- ✅ Loading states

### Future Enhancements

- [ ] Redis caching for API responses
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Background job processing

## 🔄 Updates & Maintenance

### Regular Tasks

- Monitor error logs
- Update dependencies monthly
- Backup database regularly
- Review and rotate API keys
- Monitor usage and costs

### Scaling Considerations

- Database performance monitoring
- API rate limit adjustments
- Infrastructure scaling (if needed)
- Cost optimization

---

## 🆘 Emergency Contacts

- **Domain Issues**: Your domain provider
- **Database Issues**: Convex support
- **Payment Issues**: Razorpay support
- **Hosting Issues**: Platform-specific support

## 📞 Support

For any deployment issues:

1. Check the health endpoint first
2. Review error logs
3. Verify environment variables
4. Test in development environment
5. Check this guide for common solutions

---

**Ready to deploy?** Run `npm run deploy:check` to verify everything is ready!
