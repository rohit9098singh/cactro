import EventLog from '../models/EventLog.js';

const logEvent = async (eventType, videoId = null, commentId = null, noteId = null, details = {}, req = null, success = true, errorMessage = null) => {
  try {
    const eventData = {
      eventType,
      videoId,
      commentId,
      noteId,
      details,
      success,
      errorMessage
    };

    if (req) {
      eventData.userAgent = req.get('User-Agent') || '';
      eventData.ipAddress = req.ip || req.connection.remoteAddress || '';
    }

    const eventLog = new EventLog(eventData);
    await eventLog.save();
    
    console.log(`Event logged: ${eventType}`, { videoId, commentId, noteId, success });
  } catch (error) {
    console.error('Error logging event:', error);
  }
};

const eventLogger = (eventType) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      
      const details = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        requestBody: req.body
      };

      logEvent(
        eventType,
        req.params.videoId || req.body.videoId,
        req.params.commentId || req.body.commentId,
        req.params.noteId || req.body.noteId,
        details,
        req,
        isSuccess,
        isSuccess ? null : (typeof data === 'string' ? data : JSON.stringify(data))
      );

      originalSend.call(this, data);
    };

    next();
  };
};

export { logEvent, eventLogger };
