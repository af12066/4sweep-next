ifeq ($(NODE_ENV),production)
	BASE_URL := https://4sweep-next.com
else
	BASE_URL := http://localhost:3000
endif


IMAGE := 4sweep-next
TAG := latest

build:
ifndef FOURSQUARE_CLIENT_ID
	@echo FOURSQUARE_CLIENT_ID is not defined.
	@exit
else
	docker build -t $(IMAGE):$(TAG) \
	--build-arg foursquare_client_id=$(FOURSQUARE_CLIENT_ID) \
	--build-arg base_url=$(BASE_URL) .
endif

push:
ifndef REPO_URI
	@echo REPO_URI (Docker Repository URI) is not defined.
	@exit
else
	docker tag $(IMAGE):$(TAG) $(REPO_URI):$(TAG)
	docker push $(REPO_URI):$(TAG)
endif
