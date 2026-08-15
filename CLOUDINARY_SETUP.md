# 🎯 Cloudinary Setup Guide for AySmart (30-Minute Quick Start)

## Step 1: Sign Up for Cloudinary (2 minutes)

1. Go to https://cloudinary.com/users/register/free
2. Fill out the form (email, password)
3. Verify your email
4. **You'll land on the Cloudinary Dashboard**

---

## Step 2: Get Your API Credentials (1 minute)

After signing up, you'll see the Dashboard with your credentials:

**Copy these three values:**
- `Cloud Name` (e.g., `dpd1a2b3c`)
- `API Key` (e.g., `123456789012345`)
- `API Secret` (e.g., `abcDEFghijKLMnopQRSTuvwxyz`)

⚠️ **Keep API Secret private — never commit to git!**

---

## Step 3: Add to Render Environment Variables (5 minutes)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service (`ay-smart-backend`)
3. Go to **Settings** → **Environment**
4. Add these three variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

5. Click **Save Changes** (triggers auto-redeploy)

---

## Step 4: Test Locally (10 minutes)

### A. Create `.env` file in `core-backend/` directory

```bash
# core-backend/.env (add these lines)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### B. Verify packages installed

```bash
cd core-backend
pip install -r requirements.txt
```

Output should show:
```
Successfully installed cloudinary-1.36.0
Successfully installed django-cloudinary-storage-0.3.0
```

### C. Start Django dev server

```bash
python manage.py runserver
```

### D. Test admin image upload

1. Open http://localhost:8000/admin
2. Log in with admin credentials (admin / AySmartAdmin!2026)
3. Go to **Core API** → **Properties** → **Add Property**
4. Fill in fields:
   - Title: "Test Property"
   - Type: "Residential"
   - Price: "5000000"
   - Location: "Lagos"
   - Main Image URL: (leave empty for now)
   - Upload an image file via the **Images** inline section
5. Click **Save**

### E. Verify Image Uploaded to Cloudinary

After saving, do one of these checks:

**Option 1: Check Admin Page**
1. View the property you just created
2. Look at the image URL — it should say `https://res.cloudinary.com/...`

**Option 2: Check Cloudinary Dashboard**
1. Log in to Cloudinary Dashboard
2. Go to **Media Library**
3. You should see your uploaded image

**Option 3: Check API Response**
```bash
# In terminal, after creating property
curl http://localhost:8000/api/properties/1/ | grep -i cloudinary
```

Should return something like:
```json
"image": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/..."
```

---

## Step 5: Deploy to Render (5 minutes)

1. Commit and push your code to GitHub:
```bash
git add .
git commit -m "feat: add cloudinary image storage integration"
git push origin main
```

2. Render auto-detects the push and starts redeploy
3. Go to [Render Dashboard](https://dashboard.render.com) → your service
4. Wait for deployment to complete (~3-5 minutes)
5. Check the **Logs** tab for errors

---

## Step 6: Test on Production (5 minutes)

1. Open your admin panel: https://api.aysmartinvestmentltd.com/admin
2. Log in with admin credentials
3. Create a new property with image upload
4. Verify image URL contains `cloudinary.com`

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'cloudinary'"
**Fix**: Run `pip install -r requirements.txt` in the virtual environment

### Image upload fails silently
**Check logs**:
```bash
# In Render dashboard, go to Logs
# Look for errors like: "403 Unauthorized" or "Invalid credentials"
```

**Fix**: Verify CLOUDINARY_* env vars are correct in Render dashboard

### Images still upload to `/media/` folder
**This is OK** — it means Cloudinary fallback activated (env vars not set).  
The code automatically uses local storage if Cloudinary is not configured.

### "Cloudinary API Key is invalid"
**Fix**: 
1. Log back into Cloudinary Dashboard
2. Copy exact values (no extra spaces)
3. Update Render env vars
4. Trigger redeploy

---

## Success Indicators ✅

After completing all steps, you should see:

- [ ] Cloudinary packages installed locally
- [ ] Admin property form loads without errors
- [ ] Image upload works in admin
- [ ] Cloudinary URL appears in property detail API response
- [ ] Image appears in Cloudinary Media Library dashboard
- [ ] Production deployment completes without errors

---

## What Happens Next?

### Automatic Image Optimization
Once uploaded to Cloudinary, you can transform images on-the-fly:

```
Original: https://res.cloudinary.com/cloud/image/upload/v1234/image.jpg
Thumbnail: https://res.cloudinary.com/cloud/image/upload/c_fill,w_400,h_300/v1234/image.jpg
Detail: https://res.cloudinary.com/cloud/image/upload/c_scale,w_1200/v1234/image.jpg
```

No pre-processing needed!

### Free Tier Limits
- **1 GB storage** (covers ~100-200 properties with 5 images each)
- **2 GB bandwidth/month** (reset monthly)
- **1,000 API calls/day**

Once you hit limits (estimated Month 6-12 at growth), upgrade to paid plan ($5-100/month).

---

## Questions?

If images still aren't uploading:

1. **Check Render logs** for Python errors
2. **Verify .env file** in core-backend/ directory
3. **Test API directly**:
   ```bash
   curl -X POST http://localhost:8000/api/properties/ \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "title=Test" \
     -F "image=@/path/to/image.jpg"
   ```

Good luck! 🚀
