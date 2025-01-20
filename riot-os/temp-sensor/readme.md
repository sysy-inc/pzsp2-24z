used riot ver: 2023.10

Compile for the board:
```bash
sudo make \
    BOARD=nucleo-f207zg \
    HOST_IPV6=fe80::2ef0:5dff:fe9e:fbdb \
    HOST_PORT=5000 \
    MEASUREMENT_INTERVAL_MSEC=4000 \
    SENSOR_ID_TEMP=1 \
    SENSOR_ID_HUM=2 \
flash
```

Connect to the board:
```bash
sudo make \
    BOARD=nucleo-f207zg \
    term
```

---

To compile `decrypt.c` run in `server_py`:
```bash
gcc -shared -o decrypt.so -fPIC decrypt.c aes.c
```
after compiling only the file `descrypt.so` is needed, the other can be deleted.

To test setup correct tap interface, also used for tests:
```bash
sudo ip tuntap add tap0 mode tap user $USER
sudo ip link set tap0 up
sudo ip addr add fe80::fcc1:23ff:fee8:2472/64 dev tap0
```
