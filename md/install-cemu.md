## Installation - Cemu

---

Requirements:

- Wii U with SPFN set up
- SD Card (Preferrably 32GB)
- Computer or other device to access SD Card
- Device that can run Cemu
- An internet connection

---

### Step 1: Dump Necessary Files

This guide requires that you have already set up SPFN on your Wii U and created an account. Account creation is currently unavailable on this website. If you have not done this yet, [follow this guide](/guides?guide=install-wiiu)

You will also need to dump your SPFN account and `otp.bin` and `seeprom.bin`files from your Wii U. Follow Cemu's [guide to dump online files](https://cemu.cfw.guide/using-dumpling.html#online-files) and dump your SPFN account. Take this time to also dump your Splatoon game if you haven't already done so.

Transfer the dumped files to your computer.

---

### Step 2: Cemu Configuration

Make sure you are using the latest version of Cemu. This can be found [here](https://github.com/cemu-project/Cemu/releases). 

Open Cemu and go to `File -> Open Cemu Folder`. Place the dumped `mlc01` folder, the `otp.bin` file and the `seeprom.bin` file into the Cemu folder.

Download the following file: network_services.xml (LINK NOT AVAILABLE) and place it into the Cemu folder

Open Cemu and go to `Options -> General Settings`. In the `Account` tab, make sure your SPFN account is selected. If not, select it from the dropdown.

You should see the option to switch to Cusom network services. Select this. If you can't select it, you haven't added the `network_services.xml` file correctly.

Open Splatoon and check that you get the news.

You are now ready to play on the Splatfestival Network! [Join the Discord](https://discord.gg/grMSxZf) for information about upcoming or active Splatfests and other updates.