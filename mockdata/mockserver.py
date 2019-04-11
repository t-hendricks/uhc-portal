#!/usr/bin/env python3
import http.server
import os.path

class Handler(http.server.SimpleHTTPRequestHandler):
  def __init__(self, *args, **kwargs):
    directory = os.path.dirname(os.path.realpath(__file__))
    super().__init__(*args, directory=directory, **kwargs)

  def translate_path(self, path):
    return super().translate_path(path) + '.json'

  def end_headers(self):
    """ override end_headers to append headers to every request """
    # Allow CORS.
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', '*')
    self.send_header('Access-Control-Allow-Headers', 'authorization, content-type')
    # Disable caching - https://stackoverflow.com/a/25708957/239657
    self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
    self.send_header("Pragma", "no-cache")
    self.send_header("Expires", "0")
    return super().end_headers()


  def do_OPTIONS(self):
      self.send_response(200, "ok")
      self.end_headers()

  def do_POST(self):
    return self.do_GET()

def main():
    server_address = ('localhost', 8000)
    httpd = http.server.ThreadingHTTPServer(server_address, Handler)
    httpd.serve_forever()

if __name__ == '__main__':
  main()
