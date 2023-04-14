# vlcn-live-examples

Example apps. Deployed to https://vlcn-live-examples2.fly.dev

If you're using NextJS, see https://github.com/vlcn-io/nextjs-starter

- TodoMVC: https://vlcn-live-examples2.fly.dev/todomvc.html
  - After opening a todo list, share the link with others to collaborate on that list.
- Strut
- TodoMVC p2p: https://vlcn-live-examples2.fly.dev/todomvc-p2p.html
  - Copy a peer id from one peer, connect to it from another peer


---

Running locally:

```
git clone git@github.com:vlcn-io/live-examples.git
cd live-examples
npm install
npm start:dev && npm start:ui
```

For the p2p example, you'll need to run a peer js server for discover:

```
npm install peer -g
peerjs --port 9000 --path /examples
```
