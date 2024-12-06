#include <stdio.h>

#include "net/af.h"
#include "net/protnum.h"
#include "net/ipv6/addr.h"
#include "net/sock/udp.h"
// #include "xtimer.h"

uint8_t buf[7];

int main(void)
{
    // sock_udp_ep_t local = SOCK_IPV6_EP_ANY;
    // sock_udp_t sock;

    // local.port = 0xabcd;

    // if (sock_udp_create(&sock, &local, NULL, 0) < 0) {
    //     puts("Error creating UDP sock");
    //     return 1;
    // }
    while (1)
    {
        sock_udp_ep_t gw;
        memset(&gw, 0, sizeof(gw));
        gw.family = AF_INET6;
        gw.port = 12345;
        gw.addr.ipv6[0] = 0xfe;
        gw.addr.ipv6[1] = 0x80;
        gw.addr.ipv6[2] = 0;
        gw.addr.ipv6[3] = 0;
        gw.addr.ipv6[4] = 0;
        gw.addr.ipv6[5] = 0;
        gw.addr.ipv6[6] = 0;
        gw.addr.ipv6[7] = 0;
        gw.addr.ipv6[8] = 0x0c;
        gw.addr.ipv6[9] = 0x8a;
        gw.addr.ipv6[10] = 0xe3;
        gw.addr.ipv6[11] = 0xff;
        gw.addr.ipv6[12] = 0xfe;
        gw.addr.ipv6[13] = 0xa4;
        gw.addr.ipv6[14] = 0x87;
        gw.addr.ipv6[15] = 0xb9;
        sock_udp_send(NULL, "Hello!", sizeof("Hello!"), &gw);
        printf("Sent message\n");
    // xtimer_sleep(1);
    }

    // while (1) {
    //     sock_udp_ep_t remote = { .family = AF_INET6 };
    //     ssize_t res;

    //     remote.port = 12345;
    //     ipv6_addr_set_all_nodes_multicast((ipv6_addr_t *)&remote.addr.ipv6,
    //                                       IPV6_ADDR_MCAST_SCP_LINK_LOCAL);
    //     if (sock_udp_send(&sock, "Hello!", sizeof("Hello!"), &remote) < 0) {
    //         puts("Error sending message");
    //         sock_udp_close(&sock);
    //         return 1;
    //     }
    //     if ((res = sock_udp_recv(&sock, buf, sizeof(buf), 1 * US_PER_SEC,
    //                             NULL)) < 0) {
    //         if (res == -ETIMEDOUT) {
    //             puts("Timed out");
    //         }
    //         else {
    //             puts("Error receiving message");
    //         }
    //     }
    //     else {
    //         printf("Received message: \"");
    //         for (int i = 0; i < res; i++) {
    //             printf("%c", buf[i]);
    //         }
    //         printf("\"\n");
    //     }
    //     // xtimer_sleep(1);
    // }

    // return 0;
}
