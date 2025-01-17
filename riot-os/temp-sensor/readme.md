used riot ver: 2023.10

To compile and run program on the board:
```bash
make \
    BOARD=nucleo-f207zg \
    PROGRAMMER=cpy2remed \
    HOST_IPV6=fe80::2ef0:5dff:fe9e:fbdb \
    HOST_PORT=5000 \
    flash \
&& sudo make \
    BOARD=nucleo-f207zg \
    term
```

---

To compile `decrypt.c` run in `server_py`:
```bash
gcc -shared -o decrypt.so -fPIC decrypt.c aes.c
```