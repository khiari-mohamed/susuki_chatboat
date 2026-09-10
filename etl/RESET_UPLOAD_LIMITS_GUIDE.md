## Step-by-Step Instructions
### Step 1: Upload the Script to Server

1. **Open putty**
2. **Connect to your server:**
   - Host: `172.17.26.199` (or your server IP)
   - Username: `adm01`
   - Password: `Carpro2026++`
   - Port: `22`

2. **Navigate to the backend directory:**
   cd /home/adm01/suzuki-chatbot/suzuki-backend


3. **Verify the script exists:**
   ls -la reset-upload-limit.js
   You should see output like:
   -rw-rw-r-- 1 adm01 adm01 1630 Jun 02 11:00 reset-upload-limit.js

4. **Run the reset script:**
   node reset-upload-limit.js

5. **Expected output:**
   🗑️  Resetting upload limits...
   ✅ Deleted X upload tracking records
   ✅ Upload limits reset successfully!

✅ Done! Upload limits are now reset.
