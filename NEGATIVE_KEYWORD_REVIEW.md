# Negative Keyword Review for Avondale Campaign
**Date:** December 30, 2025  
**Total Negatives:** 72  
**Analysis:** Good foundation, needs some cleanup and optimization

---

## ✅ WHAT'S GOOD

### 1. Phrase Match Competitor Negatives (Excellent!)
You've added phrase match negatives for competitor brands - this is exactly what you need:
- `"afi property management"` ✅
- `"celtic property management"` ✅
- `"caballero property management"` ✅
- `"property pro realty"` ✅
- `"ben property management"` ✅
- `"cohere management company"` ✅
- `"property management pmi"` ✅
- `"tct west property management"` ✅
- And many more!

**Status:** Perfect - keep all phrase match competitor negatives!

### 2. Campaign-Level City Negatives (Good!)
- `phoenix`, `tempe`, `surprise`, `glendale`, `mesa`, `chandler` at Campaign level ✅
- `brewer and stratton`, `rpm`, `ppg` at Campaign level ✅

**Status:** Good - these apply to entire campaign.

### 3. Tenant-Focused Negatives (Good!)
- `for rent`, `rental listings`, `houses for rent`, `homes for rent`
- `rent near me`, `apartments near me`, `places for rent`, `studios for rent`
- `pet friendly`, `available now`, `move in`, `credit check`

**Status:** Good - these block tenant searches.

---

## ⚠️ ISSUES TO FIX

### Issue 1: Most Negatives Are Ad Group Level (Should Be Campaign Level)

**Problem:** Most of your negatives are at Ad group level, but they should be Campaign level so they apply to all ad groups.

**Current:**
- Most competitor/tenant negatives are at Ad group level
- Only 9 negatives are at Campaign level

**Solution:** Move all negatives to Campaign level (except maybe very specific ones that only apply to one ad group, but you only have one ad group anyway).

**Action:** Move these from Ad group → Campaign level:
- All competitor brand negatives
- All tenant-focused negatives
- All generic service negatives

**How to fix:**
1. In Google Ads, go to Negative Keywords
2. Select all Ad group level negatives
3. Remove them from Ad group
4. Add them at Campaign level instead

---

### Issue 2: Duplicate Negatives (Broad + Phrase for Same Competitor)

**Current situation:**
- `celtic` (Broad) + `"celtic property management"` (Phrase) ✅ This is fine - both work
- `bridge` (Broad) + `bridge property management` (Broad) + `"bridge property management"` (Phrase) - Redundant
- `ben` (Broad) + `ben property management` (Broad) + `"ben property management"` (Phrase) - Redundant
- `caballero` (Broad) + `caballero property management` (Broad) + `"caballero property management"` (Phrase) - Redundant

**Analysis:** Having both broad and phrase is actually fine - they work together. But you can simplify by removing the broad match single-word versions if you have the phrase match.

**Recommendation:** Keep phrase match versions, remove single-word broad match versions for competitors:
- Remove: `celtic` (Broad) - keep `"celtic property management"` (Phrase)
- Remove: `bridge` (Broad) - keep `"bridge property management"` (Phrase)
- Remove: `ben` (Broad) - keep `"ben property management"` (Phrase)
- Remove: `caballero` (Broad) - keep `"caballero property management"` (Phrase)
- Remove: `barnett` (Broad) - keep `"barnett management company"` (Phrase)
- Remove: `chohere` (Broad) - keep `"cohere management company"` (Phrase)

---

### Issue 3: "apartment" as Phrase Match

**Current:** `"apartment"` (Phrase match, Campaign level)

**Problem:** Phrase match for single word doesn't make sense. Should be broad match.

**Fix:** Change `"apartment"` to `apartment` (Broad match)

---

### Issue 4: Missing Some Competitor Phrase Match Negatives

**From your search terms report, you're still seeing:**
- Need to add: `"rpm property management"` (Phrase) - You have `rpm` (Broad) but need phrase too
- Need to add: `"ppg property management"` (Phrase) - You have `ppg` (Broad) but need phrase too

---

### Issue 5: Some Generic Broad Match Negatives

**Current:** Single-word broad match negatives like `celtic`, `bridge`, `ben`, `caballero`, `barnett`, `chohere`

**Problem:** Single-word broad match can block too much. Better to use phrase match for full competitor names.

**Solution:** Remove single-word broad match, keep phrase match versions.

---

## 📋 RECOMMENDED ACTIONS

### Action 1: Move Negatives to Campaign Level (Priority: High)

Move all Ad group level negatives to Campaign level:

**All these should be Campaign level:**
- Competitor brand negatives (all phrase match ones)
- Tenant-focused negatives
- Service/irrelevant negatives
- City negatives (already at Campaign level ✅)

**How:** 
1. Export current Ad group negatives
2. Add them at Campaign level
3. Remove from Ad group level

---

### Action 2: Remove Single-Word Broad Match Competitor Negatives (Priority: Medium)

Remove these (keep the phrase match versions instead):
- `celtic` (Broad) - Keep `"celtic property management"` (Phrase)
- `bridge` (Broad) - Keep `"bridge property management"` (Phrase)
- `ben` (Broad) - Keep `"ben property management"` (Phrase)
- `caballero` (Broad) - Keep `"caballero property management"` (Phrase)
- `barnett` (Broad) - Keep `"barnett management company"` (Phrase)
- `chohere` (Broad) - Keep `"cohere management company"` (Phrase)
- `asset living` (Phrase) - Keep `"asset living properties"` (Phrase) - Actually you have both, remove the shorter one
- `"ah"` (Phrase) - This is probably too broad, remove it

**Keep:** Single-word broad match for generic terms like `rent`, `renting`, `pet friendly`, etc.

---

### Action 3: Add Missing Phrase Match Competitor Negatives (Priority: High)

Add these at Campaign level (phrase match):
```
"rpm property management"
"ppg property management"
```

You have `rpm` and `ppg` as broad match, but need phrase match too.

---

### Action 4: Fix "apartment" Negative (Priority: Low)

Change: `"apartment"` (Phrase) → `apartment` (Broad match)

---

## ✅ WHAT TO KEEP (Perfect as-is)

**Campaign Level (Keep):**
- `brewer and stratton` (Broad)
- `tempe`, `surprise`, `phoenix`, `glendale`, `mesa`, `chandler` (Broad)
- `rpm`, `ppg` (Broad) - but add phrase match versions too
- `"apartment"` (but change to Broad match)

**Ad Group Level → Move to Campaign Level:**
- All phrase match competitor negatives (move to Campaign)
- All tenant-focused negatives (move to Campaign)
- All service/irrelevant negatives (move to Campaign)

---

## 📊 OPTIMIZED STRUCTURE

### Campaign Level Negatives (Should have ~60-65 negatives):

**City Negatives (Broad match):**
- `phoenix`, `tempe`, `surprise`, `glendale`, `mesa`, `chandler` ✅

**Competitor Brand Negatives:**
- `rpm` (Broad) + `"rpm property management"` (Phrase) - Add phrase
- `ppg` (Broad) + `"ppg property management"` (Phrase) - Add phrase
- `brewer and stratton` (Broad) ✅
- All phrase match competitor negatives (move from Ad group) ✅

**Tenant-Focused Negatives (Broad match):**
- `rent`, `renting`, `for rent`, `rental listings`
- `houses for rent`, `homes for rent`, `studios for rent`, `places for rent`
- `rent near me`, `apartments near me` (phrase match)
- `pet friendly`, `available now`, `move in`, `credit check`
- `"background check"` (phrase match)

**Other City Negatives (Phrase match):**
- `"property management surprise"`, `"property management buckeye"`, `"property management buckeye az"`, `"property management companies surprise"`

**Service/Irrelevant Negatives:**
- Keep generic service negatives

### Remove:
- Single-word broad match competitor negatives (if you have phrase match version)
- `"ah"` (too broad)

---

## 🎯 SUMMARY

**Current Status:** Good foundation with phrase match competitor negatives ✅

**Main Issues:**
1. Most negatives at Ad group level (should be Campaign level)
2. Some redundant single-word broad match negatives
3. Missing phrase match versions of `rpm` and `ppg`
4. `"apartment"` should be broad match, not phrase

**Action Priority:**
1. **High:** Move all negatives to Campaign level
2. **High:** Add `"rpm property management"` and `"ppg property management"` (phrase match)
3. **Medium:** Remove redundant single-word broad match competitor negatives
4. **Low:** Fix `"apartment"` to broad match

---

## ✅ AFTER OPTIMIZATION

You should have:
- **60-65 Campaign-level negatives** (applies to all ad groups)
- **0-5 Ad group-level negatives** (only if very specific)
- **Mix of broad and phrase match** (broad for generic terms, phrase for competitor brands)
- **Better blocking** of competitor and tenant searches

---

**Your negative keyword setup is solid - just needs to be organized better with most at Campaign level!**

