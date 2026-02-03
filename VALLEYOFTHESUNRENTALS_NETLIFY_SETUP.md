# Bring valleyofthesunrentals.com to Netlify (Free SSL)

**Goal:** Have valleyofthesunrentals.com show the same SunSeeker site as sunseekerrentals.com, with free HTTPS via Netlify instead of paying GoDaddy for SSL.

**Current state (GoDaddy):**
- valleyofthesunrentals.com is set to **forward** (301) to sunseekerrentals.com.
- DNS is at GoDaddy (nameservers: ns07.domaincontrol.com, ns08.domaincontrol.com).
- Email is through **Gmail**; you no longer use valleyofthesunrentals.com or Skype/Teams for email.

---

## What to add in Netlify DNS (minimal — website only)

You use **Gmail** for email and no longer use valleyofthesunrentals.com or Skype/Teams for anything. So you **do not need to copy any email or Microsoft records** from GoDaddy.

**Add in Netlify DNS: nothing extra.**  
When you add valleyofthesunrentals.com in Netlify and choose Netlify DNS, Netlify will create the records needed for the website (A/ALIAS for the domain, CNAME for www). You don’t need to add MX, TXT, autodiscover, or any other GoDaddy records.

**Steps (minimal):**
1. In Netlify: add **valleyofthesunrentals.com** (and **www.valleyofthesunrentals.com** if you want www) → choose **Use Netlify DNS** → note the 4 nameservers.
2. In GoDaddy: **remove** the forwarding for valleyofthesunrentals.com.
3. In GoDaddy: **change nameservers** to the 4 Netlify nameservers.
4. Wait for DNS to propagate; Netlify will issue free SSL.

No MX, TXT, or CNAME records to copy.

---

## Option A: Use Netlify DNS (recommended — free SSL, one place for DNS)

### Step 1: Add the domain in Netlify

1. Log in to [Netlify](https://app.netlify.com) and open the site that hosts **sunseekerrentals.com**.
2. Go to **Domain management** (or **Site configuration → Domain management**).
3. Click **Add custom domain** or **Add domain alias**.
4. Enter **valleyofthesunrentals.com** and add it.
5. Also add **www.valleyofthesunrentals.com** if you want www to work.
6. When Netlify asks how you want to set up DNS, choose **Use Netlify DNS** (delegate the domain to Netlify). Netlify will show you **4 nameservers**, e.g.:
   - `dns1.p01.nsone.net`
   - `dns2.p01.nsone.net`
   - `dns3.p01.nsone.net`
   - `dns4.p01.nsone.net`  
   *(Your actual values will be shown in the Netlify UI.)*

### Step 2: (No extra records)

You don’t use email or Teams/Skype on this domain, so you don’t need to add any MX, TXT, or CNAME records in Netlify. Netlify’s default records for the domain and www are enough.

### Step 3: Switch nameservers at GoDaddy

1. In **GoDaddy**: open **My Products** → **valleyofthesunrentals.com** → **DNS** (or **Manage DNS**).
2. Go to the **Nameservers** section.
3. Click **Change** / **Change Nameservers**.
4. Choose **Custom** (or “I’ll use my own nameservers”).
5. Enter the **4 Netlify nameservers** from Step 1 (exactly as Netlify shows them).
6. Save.

**Important:** In GoDaddy, **remove the domain forwarding** for valleyofthesunrentals.com (Forwarding tab → delete or turn off the forward to sunseekerrentals.com). Forwarding would prevent Netlify from serving the site and issuing SSL.

### Step 4: Wait for DNS and SSL

- DNS can take from a few minutes up to 24–48 hours (depending on TTL and caches).
- After the domain resolves to Netlify, Netlify will automatically request a free Let’s Encrypt certificate for valleyofthesunrentals.com (and www if you added it).
- In Netlify **Domain management**, you can see when the certificate is issued (HTTPS available).

### Step 5: Optional – redirect valleyofthesunrentals.com to sunseekerrentals.com

If you want everyone who type valleyofthesunrentals.com to **end up on** sunseekerrentals.com (same content, same URL in the address bar):

1. In Netlify: **Domain management** → select **valleyofthesunrentals.com**.
2. Use **Redirects** (or **HTTPS** → **Force HTTPS** and then add a redirect):
   - **From:** `https://valleyofthesunrentals.com/*`
   - **To:** `https://www.sunseekerrentals.com/:splat`
   - **Status:** 301  
   (And similarly for `https://www.valleyofthesunrentals.com/*` if you use www.)

If you **don’t** add this redirect, both domains will show the same site but the URL will stay as valleyofthesunrentals.com (which is fine and still gets free SSL).

---

## Option B: Keep DNS at GoDaddy, point domain to Netlify

If you prefer not to change nameservers:

1. **In Netlify:** Add **valleyofthesunrentals.com** (and www if needed) as a custom domain to the same site, as in Option A Step 1.
2. Netlify will show you what to set at your DNS provider, e.g.:
   - **A record** for `@` (apex): Netlify load balancer IP(s), e.g. `75.2.60.5` (confirm in Netlify UI).
   - **CNAME** for `www`: your site’s Netlify hostname (e.g. `yoursite.netlify.app`).
3. **In GoDaddy:**  
   - **Remove** the forwarding for valleyofthesunrentals.com.  
   - In **DNS Records**, set the **A** and **CNAME** as Netlify instructs.  
   - Keep your existing MX and TXT records for email; don’t remove them.
4. Save and wait for DNS to propagate; Netlify will then issue free SSL.

Downside: you stay on GoDaddy DNS and any future SSL/DNS quirks are between GoDaddy and Netlify. Option A (Netlify DNS) is simpler and keeps everything in one place.

---

## Checklist (Option A)

- [ ] Add valleyofthesunrentals.com (and www) in Netlify Domain management; choose **Use Netlify DNS** and note the 4 nameservers.
- [ ] In GoDaddy, **remove** forwarding for valleyofthesunrentals.com.
- [ ] In GoDaddy, change nameservers to Netlify’s 4 nameservers.
- [ ] Wait for DNS propagation; confirm HTTPS works for valleyofthesunrentals.com.
- [ ] (Optional) Add 301 redirect from valleyofthesunrentals.com → sunseekerrentals.com in Netlify.

---

Once the domain is on Netlify, Netlify provides free SSL; you don’t need to buy SSL from GoDaddy for valleyofthesunrentals.com.
