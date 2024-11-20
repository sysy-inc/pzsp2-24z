# name of your application
APPLICATION = tmep-test

# If no BOARD is found in the environment, use this default:
BOARD ?= native

# This has to be the absolute path to the RIOT base directory:
RIOTBASE ?= /home/adrwal/RIOT/

# we want to use SAUL:
# USEMODULE += saul_default
# include the shell:
# USEMODULE += shell_cmds_default
# additional modules for debugging:
# USEMODULE += ps
USEMODULE += dht
USEMODULE += fmt
USEMODULE += ztimer_msec

# FEATURES_OPTIONAL += periph_rtc

# Comment this out to disable code in RIOT that does safety checking
# which is not needed in a production environment but helps in the
# development process:
DEVELHELP ?= 1

# Change this to 0 show compiler invocation lines by default:
QUIET ?= 1

include $(RIOTBASE)/Makefile.include
