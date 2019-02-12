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
    """ override end_headers to append CORS headers to every request """
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', '*')
    self.send_header('Access-Control-Allow-Headers', 'authorization')
    return super().end_headers()


  def do_OPTIONS(self):
      self.send_response(200, "ok")
      self.end_headers()

def main():
    server_address = ('localhost', 8000)
    httpd = http.server.ThreadingHTTPServer(server_address, Handler)
    httpd.serve_forever()

if __name__ == '__main__':
  main()