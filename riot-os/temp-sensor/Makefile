# name of your application
APPLICATION = tmep-test

# If no BOARD is found in the environment, use this default:
BOARD ?= native

# This has to be the absolute path to the RIOT base directory:
RIOTBASE ?= /home/adrwal/RIOT/

USEMODULE += ztimer_msec
USEMODULE += gnrc_icmpv6_error
USEMODULE += gnrc_ipv6_router_default
USEMODULE += gnrc_rpl
USEMODULE += auto_init_gnrc_rpl
USEMODULE += shell_cmd_gnrc_udp # this is udp command
USEMODULE += netstats_l2
USEMODULE += netstats_ipv6
USEMODULE += netstats_rpl
USEMODULE += netdev_default
USEMODULE += auto_init_gnrc_netif
USEMODULE += gnrc_ipv6_default
USEMODULE += sock_udp
USEMODULE += posix_sockets
USEMODULE += posix_sleep
USEMODULE += posix_inet

# Comment this out to disable code in RIOT that does safety checking
# which is not needed in a production environment but helps in the
# development process:
DEVELHELP ?= 1

# Change this to 0 show compiler invocation lines by default:
QUIET ?= 1

ifeq ($(BOARD),nucleo-f207zg)
CFLAGS += -mfloat-abi=soft -mfpu=vfp
endif

ifeq ($(TEST),yes)
CFLAGS += -DTEST
CFLAGS += -DNATIVE_AUTO_EXIT
endif

ifeq ($(TEST_UDP_IPV6),yes)
CFLAGS += -DTEST_UDP_IPV6
endif

CFLAGS += -DHOST_IPV6=\"$(HOST_IPV6)\"
CFLAGS += -DHOST_PORT=\"$(HOST_PORT)\"


include $(RIOTBASE)/Makefile.include
