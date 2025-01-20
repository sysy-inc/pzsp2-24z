To compile run:
```bash
gcc -shared -o decrypt.so -fPIC decrypt.c aes.c
```
after compiling only the file `descrypt.so` is needed, the other can be deleted.