function bindServerSideEvent ({ app, path, action, onClose }) {
  app.get(path, async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    action({ req, res });

    onClose && req.on('close', () => { onClose({ req, res }); });
  });
}

module.exports = { bindServerSideEvent };