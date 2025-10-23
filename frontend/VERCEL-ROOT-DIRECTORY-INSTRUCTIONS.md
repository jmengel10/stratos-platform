# 📂 How to Change Root Directory in Vercel

**Quick Answer**: Settings → General → Root Directory → Edit → Type "frontend" → Save

---

## 🎯 **STEP-BY-STEP INSTRUCTIONS**

### Step 1: Go to Your Project Settings

**URL**: https://vercel.com/stratos/settings

**Or navigate**:
1. Go to: https://vercel.com/dashboard
2. Click on your "**stratos**" project
3. Click "**Settings**" tab (at the top)

---

### Step 2: Find Root Directory Setting

1. You should be on the "**General**" tab (left sidebar)
2. **Scroll down** to the section called "**Build & Development Settings**"
3. Look for "**Root Directory**"

**It will look something like this**:
```
Root Directory
./
[Edit]
```

---

### Step 3: Change to Frontend

1. **Click**: The "**Edit**" button next to Root Directory
2. **Type**: `frontend` (just the word frontend, no slashes)
3. **Click**: "**Save**"

**You should see**:
```
Root Directory
frontend
[Edit]
```

---

### Step 4: Redeploy

1. **Click**: "**Deployments**" tab (at the top)
2. **Find**: Your most recent (failed) deployment
3. **Click**: The "**...**" menu button (three dots)
4. **Click**: "**Redeploy**"
5. **Confirm**: Click "**Redeploy**" in the popup

---

### Step 5: Wait and Verify

**Wait 2-3 minutes** while Vercel builds

**You'll see**:
- Building...
- Running Build Command...
- ✅ Build completed
- ✅ Deployment ready
- ✅ Production: https://stratos.vercel.app

---

## ✅ **VERIFICATION**

### After successful deployment:

1. **Visit**: https://stratos.vercel.app/dashboard
2. **Should see**: Your beautiful dashboard with KPIs!
3. **Visit**: https://stratos.vercel.app/settings
4. **Should see**: Settings page with all 6 sections!

---

## 📋 **VISUAL GUIDE**

### Where to Find Each Setting:

**URL Bar**:
```
https://vercel.com/stratos/settings
```

**Page Structure**:
```
Vercel Dashboard
├── [Your Projects]
├── stratos ← YOUR PROJECT
    ├── Deployments
    ├── Settings ← CLICK HERE
        ├── General ← YOU ARE HERE
        │   └── Build & Development Settings
        │       └── Root Directory ← EDIT THIS
        ├── Domains
        ├── Environment Variables
        └── ...
```

**What to Change**:
```
Root Directory
Before: ./
After:  frontend  ← Type this
```

---

## 🆘 **TROUBLESHOOTING**

### Can't Find "Root Directory" Setting?

**Make sure you're in the right place**:
- ✅ On the "Settings" tab (not Deployments)
- ✅ On the "General" section (left sidebar)
- ✅ Scrolled down to "Build & Development Settings"

### Setting Doesn't Save?

- Try clicking "Save" again
- Refresh the page
- Try in a different browser

### Still Can't Find It?

**Alternative method - Create vercel.json in frontend folder**:

I can create a config file instead. Let me know if you need this approach!

---

## 🎯 **SUMMARY**

**What to do**:
1. Go to: https://vercel.com/stratos/settings
2. Find: "Root Directory" under "Build & Development Settings"
3. Click: "Edit"
4. Type: `frontend`
5. Click: "Save"
6. Go to: Deployments tab
7. Click: "..." → "Redeploy"

**Time**: 2 minutes  
**Result**: Successful deployment!

---

## 🚀 **AFTER THIS WORKS**

You'll have:
- ✅ Frontend live at https://stratos.vercel.app
- ✅ Dashboard accessible
- ✅ Settings accessible
- ✅ All pages working
- ✅ Beautiful UI
- ✅ **Full platform operational!**

---

**Go to https://vercel.com/stratos/settings and change Root Directory to "frontend" now!** 🚀

