#include <stdio.h>

void gnrc_udp_send(const char *addr_str, const char *port_str,
                   const char *data, size_t num, unsigned int delay);
