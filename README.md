# vlcn-live-examples

Example apps. Deployed to https://vlcn-live-examples.fly.dev/

- TodoMVC: https://vlcn-live-examples.fly.dev/todomvc.html
  - After opening a todo list, share the link with others to collaborate on that list.
- Strut
- TodoMVC p2p: https://vlcn-live-examples.fly.dev/todomvc-p2p.html


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
