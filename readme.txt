 ToolBox

Useful tools that run right in your browser. No sign-up, no tracking, just things that work.

 What's included

- **Password Generator** - makes secure passwords and shows you how strong they are
- **Unit Converter** - convert between different units (length, weight, temperature, volume)
- **Color Palette Picker** - generates nice color schemes that work together
- **Tip Calculator** - figure out how much to tip and split bills
- **BMI Calculator** - calculates BMI with a visual gauge, works with metric or imperial
- **QR Code Maker** - turn text or URLs into QR codes you can download
- **Decision Wheel** - spin a wheel to help you decide things (like what to eat)

 Features

- Runs completely in your browser. Nothing gets sent anywhere.
- Dark theme that's easy on the eyes
- Works on phones, tablets, and desktop
- No frameworks, just vanilla JavaScript and CSS
- You can customize everything - colors, tools, whatever you want

 How to run it

 Online
Just visit the deployed site (wherever you host it)

 Locally
```
cd into the folder and run:

python3 -m http.server 8000
then go to http://localhost:8000

or if you have Node.js:
npx http-server
```

 The files

- `index.html` - the HTML for all the tools
- `style.css` - styling and dark theme
- `app.js` - all the tool logic

 Want to change things?

The color scheme is defined at the top of `style.css`. You can tweak the hex values and it'll change the whole look.

If you want to add new tools, just follow the pattern of the existing ones - add a section in the HTML, some CSS, and your JavaScript code in the JS file.

The decision wheel defaults are in `app.js` - easy to change to whatever you want.

 What it uses

Vanilla HTML, CSS, and JavaScript. Uses qrcode.js for the QR code generation. That's it.

 Browsers

Works on any modern browser that's from the last few years.

 Found an issue or have ideas?

Feel free to contribute or open an issue.

 License

MIT - do whatever you want with it